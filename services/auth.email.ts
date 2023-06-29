import nodemailer from "nodemailer"
import env from "dotenv"
env.config()

const sendEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.HOST_EMAIL,
      pass: process.env.HOST_PASS
    }
  })

  const info = await transporter.sendMail({
    from: `<${process.env.HOST_EMAIL as string}>`,
    to: email,
    subject: "testingnew",
    html: `
    <h1>Reset Password</h1>
    <p>http://localhost:3000/authorization/resetpassword/${token}</p>
    `
  })
  console.log("message sent" + info.messageId)
  return `success`
}

export default sendEmail
