import { model, Schema, Document } from "mongoose";

interface Order extends Document {
  name: string;
  email: string;
  country: string;
  state: string;
  city: string;
  art: Schema.Types.ObjectId;
  size: string;
  quantity: number;
  reference: string;
  status: string;
}

const orderSchema = new Schema<Order>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      minlength: 3,
      maxlength: 30,
      lowercase: true,
      validate: {
        validator: (v: string) => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      default: "nigeria",
    },
    art: {
      type: Schema.Types.ObjectId,
      ref: "Art",
      required: [true, "Art is required"],
    },
    size: {
      type: String,
      required: [true, "Size is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    reference: {
      type: String,
      required: [true, "Reference is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["pending", "approved", "cancelled", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model<Order>("Order", orderSchema);
