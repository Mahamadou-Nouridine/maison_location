const { maisonModel } = require('../models/maison')
const userModele = require('../models/user')
const fs = require('fs');
const user = require('../models/user');

const { default: Stripe } = require('stripe')
const { v4 } = require('uuid');
const stripe = new Stripe('sk_test_51Lme52JXfDLyXNrqaFBPmVl8rVfZVWHwuKLCmbUEEYyml7Jo5zRpRPoAjY0xYB30xY5JLLUmXgnPkhpsjR7tp6uz00v5v41njT')

/*
@create maison
@delete maison
@edit maison
@louer maison
@arreter location
@get All maisons
@validate location
*/

//create maison
const createMaison = async (req, res) => {
    console.log("Create Maison");
    const { quartier, chambres, annexe, jardin, piscine, wifi, terrasse, proprioId, description, price, region, contact } = req.body;
    const images = req.files
    console.log("In the controller");
    console.log(quartier, chambres, annexe, jardin, piscine, wifi, terrasse, proprioId, price, description, images, region, contact);
    if (!images || !quartier || !chambres || !proprioId) {
        return res.status(400).json({
            message: "All fields are mandatory"
        })
    }
    const proprio = await userModele.findOne({ _id: proprioId }).exec()
    if (!proprio) {
        return res.status(400).json({
            message: "No user Found"
        })
    }
    const maison = { images: images.map(file => { return { path: file.filename } }), description, price, quartier, chambres, annexe, jardin, piscine, wifi, terrasse, proprioId, region, contact }
    const newMaison = await maisonModel.create(maison)
    proprio.maisons.push({ maisonId: newMaison._id })
    const saved = await proprio.save()
    if (!newMaison || !saved) return res.status(500).json({
        message: "server Error"
    })

    return res.status(200).json({
        message: "Maison created successfully"
    })
}

//delete mansion
const deleteMaison = async (req, res) => {
    const { maisonId, proprioId } = req.body
    console.log(maisonId, proprioId);
    if (!maisonId || !proprioId) return res.status(400).json({
        message: "All fields are required"
    })


    const fooundUser = await userModele.findOne({ _id: proprioId }).exec()
    const found = await maisonModel.findOne({ _id: maisonId }).exec();

    if (!found || !fooundUser) return res.status(400).json({
        message: "No maison or user found found"
    })

    if (found.proprioId != proprioId) {
        return res.status(400).json({
            message: "Unauthorized"
        })
    }

    // //delete photos
    for (let image of found.images) {
        fs.unlink(`./uploads/${image.path}`, (err) => {
            if (err) console.log(err)
        })
    }

    //delete from owner maisons
    for (let maison of fooundUser.maisons) {
        if (maison.maisonId == maisonId) {
            fooundUser.maisons.pull({ maisonId: maisonId })
        }
    }

    //see if the house is in rent
    if (found.locateurId) {
        const locateur = await userModele.findOne({ _id: found.locateurId }).exec()
        locateur.location = undefined
        const savedLoc = await locateur.save()
    }

    //save both maison and user
    const saved = await fooundUser.save();
    const deleted = await maisonModel.findOneAndDelete({ _id: maisonId })
    if (!deleted || !saved) return res.status(400).json({
        message: "server Error"
    })
    res.send(found)
}

//edit maison
const editMaison = async (req, res) => {
    const { maisonId, proprioId, add, imageId } = req.body;
    console.log(typeof add, imageId);

    if (!maisonId || !proprioId) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    const found = await maisonModel.findOne({ _id: maisonId }).exec();
    if (!found) return res.status(400).json({
        message: "No maison found"
    })
    if (found.proprioId != proprioId) res.status(400).json({
        message: "Unauthorized"
    })

    if (add != 'false') {
        const files = req.files
        for (let file of files) {
            found.images.push({ path: file.filename })
        }
        const saved = await found.save()
        if (!saved) return res.status(400).json({
            message: "Server error"
        })
        return res.send([saved, "add successfully"])
    } else {
        for (let image of found.images) {
            if (image.id == imageId) {
                fs.unlink(`./uploads/${image.path}`, (err) => {
                    if (err) console.log(err)
                })
            }
        }
        found.images.pull({ _id: imageId })
        const saved = await found.save()
        if (!saved) return res.status(400).json({
            message: "Server error"
        })
        return res.send([found, 'deleted successfully'])
    }
}

//louer maison
const louerMaison = async (req, res) => {
    const { maisonId, locateurId, to } = req.body
    console.log(maisonId, locateurId, to)
    if (!maisonId || !locateurId || !to) return res.status(400).json({
        message: "All field are required"
    })

    const maisonFound = await maisonModel.findOne({ _id: maisonId }).exec()
    const userFound = await userModele.findOne({ _id: locateurId }).exec()
    if (!userFound || !maisonFound) return res.status(400).json({
        message: "User or Maiosn not found"
    })
    const location = {
        maisonId,
        to,
        from: new Date().toISOString().slice(0, 10)
    }
    maisonFound.locateurId = locateurId
    maisonFound.enAttente = true
    userFound.location = location
    userFound.location.maisonId = maisonId
    userFound.location.to = to
    userFound.location.from = new Date().toISOString().slice(0, 10)
    const savedMaison = await maisonFound.save()
    const savedUser = await userFound.save()
    if (!savedUser || !savedMaison) return res.status(401).json({
        message: "Server Error"
    })


    const { amount, token } = req.body
    if (!amount || !token) {
        return res.status(401).json({ message: "need more info" })
    }
    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: amount,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email
        }, { idempotencyKey: v4() })
    }).then(result => {
        console.log("Location successful", result);
        return res.status(200).json({
            message: "Location successful"
        })
    }).catch(err => {
        console.log(err)
    })


}

//arrêter location
const arreteLocation = async (req, res) => {
    const { userId } = req.body
    if (!userId) return res.status(400).json({
        message: "user is required"
    })
    const found = await userModele.findOne({ _id: userId }).exec()
    if (!found) return res.status(401).json({
        message: "No user found"
    })
    const foundMaison = await maisonModel.findOne({ _id: found.location.maisonId }).exec()
    if (!foundMaison) return res.status(401).json({ message: 'Maison not found' })
    foundMaison.locateurId = undefined
    foundMaison.enAttente = false
    foundMaison.enLocation = false
    const savedMaison = await foundMaison.save()

    if (found.location) {
        if (!found.location.maisonId) {
            return res.status(400).json({
                message: "No ongoing location"
            })
        }
    } else {
        return res.status(400).json({
            message: "No ongoing location"
        })
    }

    found.location = undefined
    console.log(found.location);
    // found.location.from = ""
    // found.location.to = ""
    const saved = found.save()
    if (!saved || !savedMaison) return res.status(402).json({
        message: "server Error"
    })
    return res.status(200).json({
        message: "location  canceled successfully"
    })
}

//get All maison
const getAllMaison = async (req, res) => {
    const maisons = await maisonModel.find({}).lean().exec()
    if (!maisons) return res.status(401).json({ message: 'Server Error' })
    res.status(200).json({ maisons })
}

//validatre maison
const validate = async (req, res) => {
    const { proprioId, maisonId } = req.body
    if (!proprioId || !maisonId) return res.status(402).json({ message: 'All field are required' })
    const maison = await maisonModel.findOne({ _id: maisonId }).exec()
    const user = await userModele.findOne({ _id: proprioId }).exec()
    if (!user || !maison) return res.status(402).json({ message: "user or maison not found" })
    maison.enAttente = false
    maison.enLocation = true
    const saved = await maison.save()
    if (!saved) return res.status(400).json({ message: 'Server error' })
    return res.status(200).json({ message: 'Location validated' })
}

/*
@create maison
@delete maison
@edit maison
@louer maison
@arreter location
@get All maison
*/
module.exports = {
    createMaison,
    deleteMaison,
    editMaison,
    louerMaison,
    arreteLocation,
    getAllMaison,
    validate
}
