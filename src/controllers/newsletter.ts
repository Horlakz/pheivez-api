import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Subscriber from "../models/subscriber";
import sendEmail from "../config/email";

// @desc add new subscriber
// @route /subscriber
// @method POST
// @access Public
export const addSubscriber = asyncHandler(
  async (req: Request, res: Response) => {
    // get inputs
    const { name, email } = req.body;

    try {
      // check if email already exists
      const checkEmail = await Subscriber.findOne({ email });
      if (checkEmail) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }

      const subscriber = await Subscriber.create({ name, email });

      // send verification email
      const verificationLink = `${process.env.BASE_URL}/verify/${subscriber._id}`;

      const message = `
        <h1>Thank you for subscribing to our newsletter</h1>
        <p>Please click the link below to verify your email address</p>
        <a href="${verificationLink}">${verificationLink}</a>
        `;

      sendEmail(subscriber.email, "Please verify your email address", message);

      // send response
      res.status(201).json({ message: "Email Verification Sent Successfully" });
    } catch (err) {
      if (err instanceof Error) res.status(400).json({ message: err.message });
    }
  }
);

// @desc verify subscriber
// @route /subscriber/verify/:id
// @method PUT
// @access Public
export const verifySubscriber = asyncHandler(
  async (req: Request, res: Response) => {
    // get subscriber id
    const { id } = req.params;

    try {
      // find subscriber
      const subscriber = await Subscriber.findById(id);

      if (subscriber) {
        if (subscriber.isApproved) {
          res.status(400).json({ message: "Subscriber already verified" });
          return;
        }

        // update subscriber
        subscriber.isApproved = true;
        await subscriber.save();

        // send welcome email
        const message = `
          <h1>Welcome to our newsletter</h1>
          <p>You have successfully subscribed to our newsletter</p>
          <p>You will now recieve updates from now on</p>
          `;

        sendEmail(subscriber.email, "Welcome to our newsletter", message);

        // send response
        res.status(202).json({ message: "Email Verified Successfully" });
        return;
      } else {
        res.status(404).json({ message: "Subscriber not found" });
        return;
      }
    } catch (err) {
      if (err instanceof Error) res.status(400).json({ message: err.message });
    }
  }
);

// @desc get all subscribers
// @route /subscriber || /subscribers?isApproved=true
// @method GET
// @access Private
export const getSubscribers = asyncHandler(
  async (req: Request, res: Response) => {
    // get query
    const { isApproved } = req.query;

    try {
      // check if query is provided
      if (isApproved) {
        // get subscribers
        const subscribers = await Subscriber.find({ isApproved });

        res.status(200).json(subscribers);
        return;
      } else {
        // get subscribers
        const subscribers = await Subscriber.find();

        res.status(200).json(subscribers);
        return;
      }
    } catch (err) {
      if (err instanceof Error) res.status(400).json({ message: err.message });
    }
  }
);

// @desc unsubscribe from newsletter
// @route /subscriber/:id
// @method DELETE
// @access Public
export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  // get subscriber id
  const { id } = req.params;

  try {
    // find subscriber
    const subscriber = await Subscriber.findById(id);

    if (subscriber) {
      // delete subscriber
      await subscriber.remove();

      // send response
      res.status(200).json({ message: "Unsubscribed Successfully" });
      return;
    }

    res.status(404).json({ message: "Subscriber not found" });
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc send newsletter
// @route /subscriber/newsletter
// @method POST
// @access Private
export const sendNewsletter = asyncHandler(
  async (req: Request, res: Response) => {
    // get inputs
    const { title, message } = req.body;

    try {
      if (!title || !message) {
        res.status(400).json({ message: "Please provide title and message" });
        return;
      }

      // get subscribers
      const subscribers = await Subscriber.find({ isApproved: true });

      // send newsletter to all subscribers
      subscribers.forEach((subscriber) => {
        sendEmail(subscriber.email, title, message);
      });

      // send response
      res.status(200).json({ message: "Newsletter Sent Successfully" });
    } catch (err) {
      if (err instanceof Error) res.status(400).json({ message: err.message });
    }
  }
);
