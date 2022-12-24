const userModel = require('../models/user')
const { maisonModel } = require('../models/maison')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/*
@login
@refresh
@logout
*/

//login
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'All fields are required' })
    const user = await userModel.findOne({ email: email }).exec()
    if (!user) return res.status(400).json({ message: 'User not found' })
    const match = bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Password mismatch' })
    const maisons = await maisonModel.find({ proprioId: user._id }).lean().exec();

    const accessToken = jwt.sign(
        {
            'nom': user.nom,
            'email': user.email
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: '60m'
        }
    )
    
    const refreshToken = jwt.sign(
        {
            'nom': user.nom,
            'email': user.email
        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn: '7d'
        }
    )
    console.log(refreshToken);

    res.cookie(
        'jwt',
        refreshToken,
        {
            httpOnly: true, //accessible only by web server 
            secure: true, //https
            sameSite: false, //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match r
            domain: 'localhost',
        }
    )
    console.log("cookie set successfully")
    let locationMaison;
    if(user.location){
        locationMaison = await maisonModel.findOne({_id: user.location.maisonId}).lean().exec()
    }
    const sendingUser = await userModel.findOne({email: email}).select('-password').lean().exec();
    if (!sendingUser) return res.status(400).json({ message: 'User not found' })
    res.send({ user: sendingUser, maisons, accessToken, location:user.location? {
        maison: locationMaison?locationMaison:null,
        from: user.location.from,
        to: user.location.to
    }:null})
}

//refresh 
const refresh = async(req, res)=>{
    console.log(req.cookies.jwt)
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(401).json({message: 'forbidden'})
    const refreshToken = cookies.jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN,
        async(error, decoded) => {
            if(error) return res.status(403).json({message:'Forbidden'})
            const user =await userModel.findOne({ email: decoded.email}).select('-password').lean().exec()
            const maisons = await maisonModel.find({proprioId: user._id}).lean().exec()
            if(!user) return res.status(401).json({message: 'User not found'})
            let locationMaison;
            if(user.location){
                locationMaison = await maisonModel.findOne({_id: user.location.maisonId}).lean().exec()
            }
            const accessToken = jwt.sign(
                {
                    "nom" : user.nom,
                    "email": user.email
                },
                process.env.ACCESS_TOKEN,
                {
                    expiresIn: '60m'
                }
            )
            res.send({ maisons,accessToken, user, location:user.location? {
                maison: locationMaison?locationMaison:null,
                from: user.location.from,
                to: user.location.to
            }:null })
        }
    )
}

//logout
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}