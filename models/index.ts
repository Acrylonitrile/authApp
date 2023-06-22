import { Sequelize } from "sequelize"
import env from "dotenv"
env.config()

const sequelize = new Sequelize({
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: "localhost",
  dialect: "mysql"
})

export default sequelize
