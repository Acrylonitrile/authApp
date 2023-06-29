import { Router } from "express"
import AuthController from "../controller/auth.controller"
import { Request, Response } from "express"
import env from "dotenv"
import ValidationService from "../services/verify.service"

const authRouter = Router()
const authController = new AuthController()
const validationService = new ValidationService()

authRouter.post(
  "/signup",
  validationService.validateSignUp,
  authController.signUp
)
authRouter.post("/login", authController.login)
authRouter.get(
  "/pages",
  validationService.authenticateToken(
    process.env.ACCESS_TOKEN_SECRET as string
  ),
  (req: Request, res: Response) => {
    res.send(req.params.user)
  }
)
authRouter.get("/refresh", authController.refresh)
authRouter.post(
  "/forgotpassword",
  authController.getUser,
  authController.sendResetLink
)
authRouter.get(
  "/verifyresetlink",
  validationService.authenticateToken(process.env.RESET_TOKEN_SECRET as string),
  (req: Request, res: Response) => {
    res.status(200).send("verified")
  }
)
authRouter.post(
  "/resetpassword",
  validationService.authenticateToken(process.env.RESET_TOKEN_SECRET as string),
  authController.resetPassword
)

export default authRouter
