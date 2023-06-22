import express, { Request, Response } from "express"
import env from "dotenv"
import authRouter from "./router/auth.router"
import authTable from "./models/auth.table"
env.config()
const PORT = process.env.PORT || 300

const app = express()
app.use(express.json())
app.use("/auth", authRouter)

authTable.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`istening to http://localhost:${PORT}`)
  })
})
