const express = require('express')
require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
app.use(bodyParser.json())
app.use(cookieParser());
const multer = require('multer')
const userRoutes = require('./routes/user')
const maisonRoutes = require('./routes/maison')
const authRoutes = require('./routes/auth')
app.use(cors(
    {
        origin: true,
        credentials: true
    }
))
app.use(express.json())


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,__dirname + '/uploads')
    },
    filename:(req, file, cb)=>{
        console.log(file);
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/webp'){
        console.log("Working");
        cb(null, true);
    } else{
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    // fileFilter: fileFilter,
    // limits:{
    //     fileSize: 1024 * 1024 * 10
    // }
})

app.use(cors(
    {
        origin: true,
        credentials: true,
    }
))
app.use("/uploads",express.static('uploads'))
app.use('/auth',/*(req, res, next) => {
    res.cookie(
        'jwt',
        'refreshToken',
        {
            httpOnly: true, //accessible only by web server
            secure: true, //https
            sameSite: false, //cross-site cookie
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match r
            domain: 'localhost',
        }
    )
    next()
}, */authRoutes)
app.use('/maison', upload.array('maison'), maisonRoutes)
app.use('/user', userRoutes)

const port = process.env.PORT || 3800
app.use('/', async (req, res) => {
    res.json({
        message: 'welcome to the site'
    })
})

mongoose.connect(process.env.DATA_URL)
mongoose.connection.once('open', () => {
    console.log('Connecté à mongodb');
    app.listen(port, () => {
        console.log(`server running on port ${port}`);

    })
})

