import asyncHander from "express-async-handler";
import type { Request, Response } from "express";
import Tag from "../models/tag";

// @desc    Get all tags
// @route   GET /tags
// @access  Public
export const getTags = asyncHander(async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc    create Tag
// @route   POST /tags
// @access  Private
export const createTag = asyncHander(async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    // check if Tag exists
    const checkTag = await Tag.findOne({ name });
    if (checkTag) {
      res.status(400).json({ message: "Tag already exists" });
      return;
    }
    const tag = await Tag.create({ name });
    res.status(201).json(tag);
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc delete Tag
// @route DELETE /tag/:id
// @access Private
export const deleteTag = asyncHander(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res.status(200).json({ message: "Tag deleted" });
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});
