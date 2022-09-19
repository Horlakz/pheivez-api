import { Document, model, Schema } from "mongoose";

interface Category extends Document {
  name: string;
}

const categorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
  },
  { timestamps: true }
);

export default model<Category>("Category", categorySchema);
