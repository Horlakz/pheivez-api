import type { Request, Response } from "express";
import asyncHander from "express-async-handler";
import Order from "../models/order";
import Art from "../models/art";
import axios from "axios";

// @desc    Create new order
// @route   POST /order
// @access  Public
export const createOrder = asyncHander(async (req: Request, res: Response) => {
  const { name, email, country, state, city, art, size, quantity } = req.body;

  try {
    // check fields
    if (
      !name ||
      !email ||
      !country ||
      !state ||
      !city ||
      !art ||
      !size ||
      !quantity
    ) {
      res.status(400).json({ message: "All Fields are required" });
      return;
    }

    // check if art exists
    const artDetails = await Art.findById(art);
    if (!artDetails) {
      res.status(404).json({ message: "Art not found" });
      return;
    }

    // amount to pay(half payment is allowed, implement later)
    const amount = artDetails.price * quantity * 100;

    // initialize payment
    const paystack = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount,
        callback_url: "http://localhost:5000/order/success",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // create order
    const order = await Order.create({
      name,
      email,
      country,
      state,
      city,
      art,
      size,
      quantity,
      reference: paystack.data?.data?.reference,
    });

    // send response
    res
      .status(201)
      .json({ order, paymentUrl: paystack.data?.data?.authorization_url });
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc    Get order by reference
// @route   GET /order/:reference
// @access  Public
export const getOrder = asyncHander(async (req: Request, res: Response) => {
  const { reference } = req.params;

  try {
    // check if order exists
    const order = await Order.findOne({ reference });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const verifyPayment = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    switch (verifyPayment.data?.data?.status) {
      case "success":
        order.status = "approved";
        break;
      case "failed":
        order.status = "cancelled";
        break;
      case "abandoned":
        order.status = "cancelled";
        break;
      default:
        order.status = "pending";
        break;
    }

    await order.save();

    // send response
    res.status(200).json(order);
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc    Get all orders
// @route   GET /order
// @access  Private
export const getOrders = asyncHander(async (req: Request, res: Response) => {
  try {
    // get orders
    const orders = await Order.find().populate("art");

    // send response
    res.status(200).json(orders);
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc    Update order status
// @route   PUT /order/:reference
// @access  Private
export const updateOrder = asyncHander(async (req: Request, res: Response) => {
  const { reference } = req.params;
  const { status } = req.body;

  try {
    // check if order exists
    const order = await Order.findOne({ reference });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // check if status is valid
    if (!status) {
      res.status(400).json({ message: "Status is required" });
      return;
    }

    // update order
    order.status = status;
    await order.save();

    // send response
    res.status(200).json(order);
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});

// @desc    Delete order
// @route   DELETE /order/:reference
// @access  Private
export const deleteOrder = asyncHander(async (req: Request, res: Response) => {
  const { reference } = req.params;

  try {
    // check if order exists
    const order = await Order.findOne({ reference });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // delete order
    await order.remove();

    // send response
    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    if (err instanceof Error) res.status(400).json({ message: err.message });
  }
});
