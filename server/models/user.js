const mongoose = require('mongoose')


const maison = new mongoose.Schema({
    maisonId:{
        type:mongoose.Types.ObjectId
    }
})

const location = new mongoose.Schema({
    maisonId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    from:{
        type: String,
        required: true,
    },
    to:{
        type: String,
        required: true,
    }
})

const user = new mongoose.Schema({
    nom:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    location: location,
    maisons: [maison]
})


module.exports = mongoose.model('user', user)

