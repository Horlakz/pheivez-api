import { Document, model, Schema } from "mongoose";

interface Tag extends Document {
  name: string;
}

const tagSchema = new Schema<Tag>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 30,
    },
  },
  { timestamps: true }
);

export default model<Tag>("Tag", tagSchema);
