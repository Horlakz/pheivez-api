import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import { generateToken } from "../utils";

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
      token: generateToken(await (await User.userExists(email))._id),
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

export { register, login, getUser };
