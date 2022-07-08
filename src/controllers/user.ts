import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user";
import { generateToken, sendEmail } from "../utils";

// @desc create user
// @route /auth/register
// @method POST
// @access Public
const register = asyncHandler(async (req: Request, res: Response) => {
  // get inputs
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });

    // send response
    res.status(201).json({
      token: generateToken(user._id),
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });

    console.log(err);
  }
});

// @desc login user
// @route /auth/login
// @method POST
// @access Public
const login = asyncHandler(async (req: Request, res: Response) => {
  // get inputs
  const { email, password } = req.body;

  try {
    // match user
    const user =
      (await User.userExists(email)) && (await User.matchPassword(password));

    if (user == null || user == undefined) {
      res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // send response
    res.status(200).json({
      token: generateToken((await User.userExists(email))._id),
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });

    console.log(err);
  }
});

// @desc get user
// @route /auth/me
// @method GET
// @access Private
const getUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    // const user = await User.findById(req.user.id);
    res.status(200).json(req.user);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
    console.log(err);
  }
});

// @desc send code to reset password
// @route /auth/forgot-password
// @method POST
// @access Public
const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  // get inputs
  const { email } = req.body;

  try {
    // match user
    const user = await User.findOne({ email });

    if (user == null || user == undefined) {
      res.status(400).json({
        message: "Email is not registered",
      });
    }

    // generate 6 digit code
    const code = Math.floor(Math.random() * 900000) + 100000;

    // send email
    const send = await sendEmail(
      email,
      "Reset Password",
      `<p>You requested to reset your password. Your code is ${code}</p>`
    );

    // send response
    res.status(200).json({ message: `code sent to ${email}` });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
    console.log(err);
  }
});

export { register, login, getUser, forgotPassword };
