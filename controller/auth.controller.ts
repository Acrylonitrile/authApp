import { send } from "process"
import AuthService from "../services/auth.service"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const authService = new AuthService()

class AuthController {
  post = async (req: Request, res: Response) => {
    const userSuccess = await authService.signUp(
      req.body.userId,
      req.body.password
    )
    res.status(201).send(`successfully created user ${userSuccess}`)
  }
  get = async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.login(req.body.userId, req.body.password)
    if (!result.isSuccess) {
      res.status(401).send(result)
      return
    }
    req.headers.authorization = result.accesstoken
    res.status(201).send(result)
  }
  authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return res.status(401).send("no token")
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, user) => {
        if (err) return res.status(403).send("invalid token")
        req.params.user = user as string
        next()
      }
    )
  }
}

export default AuthController
