import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { streamFile } from "../config/media";
import { pipeline } from "stream/promises";

export const getFile = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  const readStream = streamFile(key);

  res.setHeader("Content-Type", "image/jpeg");
  await pipeline(readStream, res);
});
