import { Document, model, Schema } from "mongoose";

interface Subscriber extends Document {
  name: string;
  email: string;
}

const subscriberSchema = new Schema<Subscriber>(
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
      unique: true,
      validate: {
        validator: (v: string) => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

export default model<Subscriber>("Subscriber", subscriberSchema);
