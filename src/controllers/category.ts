import asyncHander from "express-async-handler";
import type { Request, Response } from "express";
import Category from "../models/category";

// @desc    Get all categories
// @route   GET /categories
// @access  Public
export const getCategories = asyncHander(
  async (req: Request, res: Response) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      if (err instanceof Error) res.status(400).json({ message: err.message });
    }
  }
);

// @desc    create category
// @route   POST /categories
// @access  Private
export const createCategory = asyncHander(
  async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
      // check if category exists
      const checkCategory = await Category.findOne({ name });
      if (checkCategory) {
        res.status(400).json({ message: "Category already exists" });
        return;
      }
      const category = await Category.create({ name });
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof Error) res.status(400).json({ message: err.message });
    }
  }
);

// @desc delete category
// @route DELETE /categories/:id
// @access Private
export const deleteCategory = asyncHander(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      res.status(200).json({ message: "Category deleted" });
    } catch (err) {
      if (err instanceof Error) res.status(400).json({ message: err.message });
    }
  }
);
