const { default: mongoose } = require('mongoose')
const mongose = require('mongoose')

const image = new mongoose.Schema({
    path: {
        type: String,
        required: true
    }
})

const maisonSchema = new mongoose.Schema({
    images:[image],
    region: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    quartier: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    chambres:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    annexe:{
        type: Boolean,
        required: true
    },
    jardin: {
        type: Boolean,
        required: true
    },
    piscine: {
        type: Boolean,
        required: true
    },
    wifi: {
        type: Boolean,
        required: true
    },
    terrasse: {
        type: Boolean,
        required: true
    },
    proprioId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    locateurId:{
        type: mongoose.Types.ObjectId,
        required:false
    },
    enLocation:{
        type: Boolean,
        required: false,
        default:false
    },
    enAttente:{
        type:Boolean,
        required: false,
        default:false
    }
})

const maisonModel = mongoose.model('maison', maisonSchema)

module.exports = {
    maisonSchema,
    maisonModel
};