import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

const testDemo = asyncHandler((req: Request, res: Response) => {
  try {
    res.json({ message: "Test Success" }).status(200);
  } catch (error) {
    res.status(400).json({ message: "Test Failed" });
  }
});

export default testDemo;
