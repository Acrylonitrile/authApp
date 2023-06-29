import { Request, Response, NextFunction } from "express"
import Joi from "joi"
import jwt from "jsonwebtoken"

const signUpSchema = Joi.object({
  userId: Joi.string().email().required(),
  password: Joi.string().min(5).required()
})

class ValidationService {
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
  authenticateToken =
    (secret: string) => (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(" ")[1]
      console.log(token)
      if (!token) return res.status(401).send("no token")
      jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).send("invalid token")
        req.params.user = (<any>user).userId as string
        next()
      })
    }
}

export default ValidationService
