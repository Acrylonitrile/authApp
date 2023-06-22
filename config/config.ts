import env from "dotenv"
env.config()

const dbconfig = {
  username: process.env.MYSQL_USER as string,
  password: process.env.MYSQL_PASSWORD as string,
  database: process.env.MYSQL_DATABASER as string,
  host: "localhost",
  dialect: "mysql"
}

export default dbconfig
