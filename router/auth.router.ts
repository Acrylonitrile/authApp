import { Router } from "express"
import AuthController from "../controller/auth.controller"
import { Request, Response } from "express"

const authRouter = Router()
const authController = new AuthController()

authRouter.post("/signup", authController.validateSignUp, authController.post)
authRouter.get("/login", authController.get)
authRouter.get(
  "/pages",
  authController.authenticateToken,
  (req: Request, res: Response) => {
    res.send(req.params.user)
  }
)
authRouter.get("/refresh", authController.refresh)

export default authRouter
