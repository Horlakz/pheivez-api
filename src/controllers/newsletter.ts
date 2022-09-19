import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Subscriber from "../models/subscriber";
import sendEmail from "../config/email";

// @desc add new subscriber
// @route /subscribers
// @method POST
// @access Public
export const addSubscriber = asyncHandler(
  async (req: Request, res: Response) => {
    // get inputs
    const { name, email } = req.body;

    try {
      const subscriber = await Subscriber.create({ name, email });

      // send verification email
      const verificationLink = `${process.env.BASE_URL}/subscribers/verify/${subscriber._id}`;

      const message = `
        <h1>Thank you for subscribing to our newsletter</h1>
        <p>Please click the link below to verify your email address</p>
        <a href="${verificationLink}">${verificationLink}</a>
        `;

      sendEmail(subscriber.email, "Please verify your email address", message);

      // send response
      res.status(201).json({ message: "Email Verification Sent Successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// @desc verify subscriber
// @route /subscribers/verify/:id
// @method GET
// @access Public
export const verifySubscriber = asyncHandler(
  async (req: Request, res: Response) => {
    // get subscriber id
    const { id } = req.params;

    try {
      // find subscriber
      const subscriber = await Subscriber.findById(id);

      if (subscriber) {
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
        res.status(200).json({ message: "Email Verified Successfully" });
      }

      res.status(404).json({ message: "Subscriber not found" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// @desc get all subscribers
// @route /subscribers || /subscribers?isApproved=true
// @method GET
// @access Private
export const getSubscribers = asyncHandler(
  async (req: Request, res: Response) => {
    // get query
    const { isApproved } = req.query;

    try {
      // find subscribers
      const subscribers = await Subscriber.find({ isApproved });

      // send response
      res.status(200).json(subscribers);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// @desc unsubscribe from newsletter
// @route /subscribers/:id
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
    }

    res.status(404).json({ message: "Subscriber not found" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});
