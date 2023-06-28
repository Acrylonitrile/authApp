import AuthService from "../services/auth.service"
import { Request, Response, NextFunction } from "express"
import jwt, { UserIDJwtPayload } from "jsonwebtoken"
import Joi from "joi"
import cookieParser from "cookie-parser"
import sendEmail from "../services/auth.email"

declare module "jsonwebtoken" {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    userId: string
  }
}

const signUpSchema = Joi.object({
  userId: Joi.string().email().required(),
  password: Joi.string().min(5).required()
})

const authService = new AuthService()

class AuthController {
  signUp = async (req: Request, res: Response) => {
    const userSuccess = await authService.signUp(
      req.body.userId,
      req.body.password
    )
    res.status(201).send(`successfully created user ${userSuccess}`)
  }
  login = async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.login(req.body.userId, req.body.password)
    if (!result.isSuccess) {
      res.status(401).send(result)
      return
    }
    console.log(result.accessToken)
    console.log(result.refreshToken)
    //req.headers.authorization = result.accesstoken
    res.cookie("authorization", result.accessToken)
    res.cookie("refreshToken", result.refreshToken)
    console.log(req.cookies)
    res.status(201).send(result)
  }
  authenticateToken =
    (secret: string) => (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(" ")[1]
      console.log(token)
      //console.log(req.cookies)
      // const token = req.cookies["authorization"] as string
      if (!token) return res.status(401).send("no token")
      jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).send("invalid token")
        req.params.user = user as string
        next()
      })
    }
  validateSignUp = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = signUpSchema.validate(req.body, {
      abortEarly: false
    })
    if (error) {
      console.log(error)
      return res.status(401).send(error.details)
    }
    next()
  }
  refresh = (req: Request, res: Response) => {
    const refreshToken = req.cookies["refreshToken"] as string
    if (!refreshToken) return res.status(401).send("no token provided")
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err, user) => {
        if (err) return res.status(403).send("invalid token")
        //return res.send(user)

        const accessToken = jwt.sign(
          { userId: (<any>user).userId as string },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "2 days" }
        )
        res.cookie("authorization", accessToken)
        res.send(user)
      }
    )
  }
  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userDetails = await authService.findEmail(req.body.userId)
    if (!userDetails) res.status(401).send("invalid user")
    console.log("valid user")
    next()
    // res.status(201).send(userDetails)
  }
  sendResetLink = async (req: Request, res: Response) => {
    const token = jwt.sign(
      {
        userId: req.body.userId
      },
      process.env.RESET_TOKEN_SECRET as string
    )
    try {
      const result = await sendEmail(req.body.userId, token)
      console.log(result)
      res.status(201).send(result)
    } catch (error) {
      console.log(error)
      res.status(401).send(error)
    }
  }
}

export default AuthController
