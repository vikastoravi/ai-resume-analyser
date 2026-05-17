const { Router } = require('express')
const profileController = require('../controllers/profile.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const profileRouter = Router()

profileRouter.get('/', authMiddleware.authUser, profileController.getProfileController)
profileRouter.put('/', authMiddleware.authUser, profileController.updateProfileController)

module.exports = profileRouter
