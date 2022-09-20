import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import fs from "fs";
import sendEmail from "../config/email";
import { uploadFile } from "../config/media";
import Art from "../models/art";
import Subscriber from "../models/subscriber";

// @desc    create art
// @route   POST /art
// @access  Private
export const createArt = asyncHandler(async (req: Request, res: Response) => {
  const { category, title, description, price, sizes, tags } = req.body;

  try {
    if (!category || !title || !description || !price || !sizes || !tags) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (req.file) {
      // upload file to aws s3
      const image = await uploadFile(req.file);

      // remove file from server
      fs.unlinkSync(req.file.path);

      const art = await Art.create({
        category,
        title,
        description,
        price,
        sizes,
        image: image.Key,
        tags,
      });
      const subscribers = await Subscriber.find();

      subscribers.forEach(async (subscriber) => {
        await sendEmail(
          subscriber.email,
          "New Artwork Added",
          `<h1>Hi ${subscriber.name}</h1>
            <p>A new artwork has been added to the gallery. Check it out
              <a href="https://pheivez.vercel.app/art/${art.slug}">here</a>!
            </p>
            <p>Regards,<br>Pheivez Art</p>`
        );
      });

      res.status(201).json(art);
      return;
    }

    res.status(400).json({ message: "Image is required" });
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc    get all arts
// @route   GET /art
// @access  Public
export const getArts = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const tag = req.query.tag && { tags: { $in: [req.query.tag] } };

  const category = req.query.category && {
    category: { $in: [req.query.category] },
  };

  const keyword = req.query.keyword && {
    $or: [
      { title: { $regex: req.query.keyword, $options: "i" } },
      { description: { $regex: req.query.keyword, $options: "i" } },
    ],
  };

  try {
    const count = await Art.countDocuments({ ...keyword, ...tag, ...category });

    const arts = await Art.find({ ...keyword, ...tag, ...category })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ arts, page, totalPages: Math.ceil(count / pageSize) });
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc    get art by slug
// @route   GET /art/:slug
// @access  Public
export const getArt = asyncHandler(async (req: Request, res: Response) => {
  try {
    const art = await Art.findOne({ slug: req.params.slug });

    if (art) {
      res.json(art);
      return;
    }

    res.status(404).json({ message: "Art not found" });
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc    update art
// @route   PUT /art/:slug
// @access  Private
export const updateArt = asyncHandler(async (req: Request, res: Response) => {
  try {
    const art = await Art.findOne({ slug: req.params.slug });

    if (art) {
      const updatedArt = await Art.findOneAndUpdate(
        { slug: req.params.slug },
        req.body,
        { new: true }
      );

      res.json(updatedArt);
      return;
    }

    res.status(404).json({ message: "Art not found" });
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc    delete art
// @route   DELETE /art/:slug
// @access  Private
export const deleteArt = asyncHandler(async (req: Request, res: Response) => {
  try {
    const art = await Art.findOne({ slug: req.params.slug });

    if (art) {
      await art.remove();

      res.status(204).json({ message: "Art removed" });
      return;
    }

    res.status(404).json({ message: "Art not found" });
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});
