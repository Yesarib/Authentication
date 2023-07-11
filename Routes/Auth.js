const express = require('express')
const router = express.Router()
const createError = require("http-errors")
const User = require('../Models/User.js')
const { authSchema } = require('../Helpers/Validation.js')

router.post('/register', async(req,res,next) => {
    try {
        // const { email, password } = req.body
        // if (!email || ! password) throw createError.BadRequest()

        const result = await authSchema.validateAsync(req.body)

        const doesExist = await User.findOne({email:result.email})
        if (doesExist) throw createError.Conflict(`${email} is already been registered.`)

        const user = new User({email, password})
        const savedUser = await user.save()

        res.send(savedUser)
    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
})

router.post('/login', async(req,res,next) => {
    res.send("login route")
})

router.post('/refresh-token', async(req,res,next) => {
    res.send("refresh-token route")
})

router.delete('/logout', async(req,res,next) => {
    res.send("logout route")
})




module.exports = router