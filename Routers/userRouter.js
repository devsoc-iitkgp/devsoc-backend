const { Router } = require("express")
const { createUser, fetchUserDetails, login } = require("../Controllers/user")
const authenticate = require("../middlewares/auth")

const userRouter = Router()

userRouter.get("/:id", authenticate, fetchUserDetails)
userRouter.post("/", createUser)
userRouter.post("/login", login)

module.exports = userRouter