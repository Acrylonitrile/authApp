import dotenv from "dotenv"
dotenv.config()
import authTable from "../models/auth.table"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class AuthService {
  signUp = async (userId: string, password: string) => {
    const hash = await bcrypt.hash(
      password,
      parseInt(process.env.SALT as string)
    )
    await authTable.create({
      userId: userId,
      password: hash
    })
    return userId
  }
  login = async (
    userId: string,
    password: string
  ): Promise<{
    isSuccess: boolean
    error?: string
    accessToken?: string
    refreshToken?: string
  }> => {
    const [userDetails] = await authTable.findAll({
      where: {
        userId: userId
      },
      attributes: ["password"]
    })
    if (!userDetails) return { isSuccess: false, error: "Invalid username" }
    const hash = userDetails.dataValues.password
    const isMatch = await bcrypt.compare(password, hash)
    if (!isMatch) return { isSuccess: false, error: "Invalid password" }
    const accessToken = jwt.sign(
      { userId },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15s"
      }
    )
    const refreshToken = jwt.sign(
      { userId },
      process.env.REFRESH_TOKEN_SECRET as string
    )
    return { isSuccess: true, accessToken, refreshToken }
  }
}

export default AuthService
