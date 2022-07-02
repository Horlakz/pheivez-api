import jwt from "jsonwebtoken";

// generate token function
const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// exports
export { generateToken };
