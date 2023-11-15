const createError = require("http-errors")
const User = require('../Models/User.js')
const { authSchema } = require('../Helpers/Validation.js')
const { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../Helpers/Jwt.js')
const client = require('../Helpers/init_redis.js')

module.exports = {
    register: async (req, res, next) => {
        try {
            // const { email, password } = req.body
            // if (!email || ! password) throw createError.BadRequest()

            const result = await authSchema.validateAsync(req.body)

            const doesExist = await User.findOne({ email: result.email })
            console.log(doesExist);
            if (doesExist) throw createError.Conflict(`${result.email} is already been registered.`)

            const user = new User(result)
            const savedUser = await user.save()
            const accessToken = await signAccessToken(savedUser.id)
            const refreshToken = await signRefreshToken(savedUser.id)
            res.send({ accessToken, refreshToken })
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    login: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({ email: result.email })

            if (!user) throw createError.NotFound("User not registered")

            const isMatch = await user.isValidPassword(result.password)
            if (!isMatch) throw createError.Unauthorized('Username or password is not valid')

            const accessToken = await signAccessToken(user.id)
            const refreshToken = await signRefreshToken(user.id)

            res.send({ accessToken, refreshToken })
        } catch (error) {
            if (error.isJoi === true) return next(createError.BadRequest("Invalid username or password"))
            next(error)
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) throw createError.BadRequest();

            const userId = await verifyRefreshToken(refreshToken);

            const newAccessToken = await signAccessToken(userId);
            const newRefreshToken = await signRefreshToken(userId);
            res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (error) {
            next(error)
        }
    },

    logout: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) throw createError.BadRequest();
            const userId = await verifyRefreshToken(refreshToken);

            client.DEL(userId, (err, value) => {
                if (err) {
                    console.log(err.message);
                    throw createError.InternalServerError();
                }
                console.log(value);
            })
            res.sendStatus(204);

        } catch (error) {
            next(error)
        }
    }
}