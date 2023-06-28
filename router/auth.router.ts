import { Router } from "express"
import AuthController from "../controller/auth.controller"
import { Request, Response } from "express"
import env from "dotenv"

const authRouter = Router()
const authController = new AuthController()

authRouter.post("/signup", authController.validateSignUp, authController.signUp)
authRouter.post("/login", authController.login)
authRouter.get(
  "/pages",
  authController.authenticateToken(process.env.ACCESS_TOKEN_SECRET as string),
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
  authController.authenticateToken(process.env.RESET_TOKEN_SECRET as string),
  (req: Request, res: Response) => {
    res.status(200).send("verified")
  }
)

export default authRouter
