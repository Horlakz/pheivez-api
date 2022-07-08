import type { Types } from "mongoose";
import { sign, Secret } from "jsonwebtoken";
import nodemailer from "nodemailer";

// types
type HTMLElement = string | Buffer | undefined;

// generate token function
export const generateToken = (id: Types.ObjectId) =>
  sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// send email function
export const sendEmail = async (
  email: string,
  subject: string,
  html: HTMLElement
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"Pheivez Arts" <${process.env.EMAIL}>`,
    to: email,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
