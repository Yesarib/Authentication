const express = require("express")
const morgan = require("morgan")
const createError = require("http-errors")
require('dotenv').config()
require('./Helpers/init_mongodb')


const AuthRoute = require('./Routes/Auth.js')

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', async(req,res,next) => {
    res.send("Hello")
})

app.use('/auth', AuthRoute);


app.use(async (req,res, next) => {
    // const error = new Error("Not found")
    // error.status = 404
    // next(error)
    next(createError.NotFound());
})

app.use((err, req,res, next) => {
    res.status(err.status || 500)
    res.send({
        error:  {
            status: err.status || 500,
            message: err.message
        }
    })
})




const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})