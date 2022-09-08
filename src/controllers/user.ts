import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/user";
import Code from "../models/code";
import { generateToken, sendEmail } from "../utils";

// @desc create user
// @route /auth/register
// @method POST
// @access Public
export const register = asyncHandler(async (req: Request, res: Response) => {
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
  }
});

// @desc login user
// @route /auth/login
// @method POST
// @access Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  // get inputs
  const { email, password } = req.body;

  try {
    // match user
    const user = await User.findOne({ email });

    // match password
    const isMatch = user && (await bcrypt.compare(password, user.password));

    if (!isMatch) {
      res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // send response
    isMatch &&
      res.status(200).json({
        token: generateToken(user._id),
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
export const getUser = asyncHandler(async (req: Request, res: Response) => {
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
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    // get inputs
    const { email } = req.body;

    // generate 6 digit code
    const code = Math.floor(Math.random() * 900000) + 100000;

    const html = `
      <h1>Reset Password</h1>
      <p>You requested to reset your password. The code is ${code}</p>
    `;

    try {
      // match user
      const user = await User.findOne({ email });

      if (user === null || user === undefined) {
        res.status(400).json({
          message: "Email is not registered",
        });
      }

      // if code exists, update it
      const codeExists = user && (await Code.findOne({ user: user._id }));
      if (codeExists) {
        // update code
        await Code.findOneAndUpdate({ user: user._id }, { code });

        // send email
        sendEmail(email, "Reset Password", html);

        res.status(200).json({ message: "Code has been sent to email" });
      }

      // send code to email
      sendEmail(email, "Reset Password", html);

      // save code to database
      user && (await Code.create({ user: user._id, code }));

      // send response
      res.status(200).json({ message: `code sent to ${email}` });
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
      console.log(err);
    }
  }
);

// @desc use code to reset password
// @route /auth/reset-password
// @method PUT
// @access Public
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    // get inputs
    const { email, code, password } = req.body;

    try {
      // match user
      const user = await User.findOne({ email });

      if (user === null || user === undefined) {
        res.status(400).json({
          message: "Email is not registered",
        });
      }

      if (user) {
        const codeExists = await Code.findOne({ user: user._id });

        if (!codeExists) {
          res.status(400).json({
            message: "Code does not exist",
          });
        }

        if (codeExists) {
          if (codeExists.code !== code) {
            res.status(400).json({
              message: "Invalid code",
            });
          }

          // update password
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          await User.findByIdAndUpdate(user._id, { password: hash });

          // remove code
          await Code.findOneAndRemove({ user: user._id });

          // send response
          res.status(200).json({ message: "password updated" });
        }
      }
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
      console.log(err);
    }
  }
);
