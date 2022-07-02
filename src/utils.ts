import type { Types } from "mongoose";
import jwt from "jsonwebtoken";

// generate token function
const generateToken = (id: Types.ObjectId) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// exports
export { generateToken };
