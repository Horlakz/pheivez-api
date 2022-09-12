import { Document, model, Schema } from "mongoose";

interface Art extends Document {
  category: string;
  description: string;
  image: string;
  price: number;
  sizes: string[];
  tags: Schema.Types.ObjectId[];
}

const artSchema = new Schema<Art>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: 3,
      maxlength: 30,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    sizes: {
      type: [String],
      required: [true, "Sizes are required"],
    },
    tags: {
      type: Schema.Types.Mixed,
      ref: "Tag",
      required: [true, "Tags is required"],
    },
  },
  { timestamps: true }
);

export default model<Art>("Art", artSchema);
