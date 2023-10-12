const userModel = require('../models/user')
const bcrypt = require('bcrypt')

const createUser = async (req, res)=>{
    const {password, email, nom}= req.body
    console.log(password, email, nom);
    if(!password||!email||!nom) return res.status(400).json({
        message:'All field are required'
    })

    //check duplicate 
    const dup =await userModel.findOne({nom:nom})
    if(dup) return res.status(409).json({
        message: 'client already exist'
    })
    
    const dup1 =await userModel.findOne({email})
    if(dup1) return res.status(409).json({
        message: 'client already exist'
    })
    //hash the password
    const hashedPwd = await bcrypt.hash(password, 10)

    //create and save the user
    const client = {
        nom,
        password: hashedPwd,
        email
    }

    const newUser = await   userModel.create(client)
    if(!newUser) return res.status(400).json({
        message: 'server Error'
    })

    return res.status(200).json({
        message: 'success, user created'
    })
}


module.exports = {createUser}