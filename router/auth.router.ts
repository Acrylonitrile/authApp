import { Router } from "express"
import AuthController from "../controller/auth.controller"
import { Request, Response } from "express"

const authRouter = Router()
const authController = new AuthController()

authRouter.post("/signup", authController.post)
authRouter.get("/login", authController.get)
authRouter.get(
  "/pages",
  authController.authenticateToken,
  (req: Request, res: Response) => {
    res.send(`user is ${req.params.user}`)
  }
)

export default authRouter
