import express, { Request, Response } from "express"
import env from "dotenv"
import authRouter from "./router/auth.router"
import authTable from "./models/auth.table"
import cookieParser from "cookie-parser"
import cors from "cors"
env.config()
const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true
  })
)
app.use("/auth", authRouter)

authTable.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`istening to http://localhost:${PORT}`)
  })
})
