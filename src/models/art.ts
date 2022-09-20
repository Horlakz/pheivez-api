import { Document, model, Schema } from "mongoose";
import slugify from "slugify";

interface Art extends Document {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
  sizes: string[];
  tags: Schema.Types.ObjectId[];
}

const artSchema = new Schema<Art>(
  {
    slug: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
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
    tags: [
      {
        type: Schema.Types.Mixed,
        ref: "Tag",
        required: [true, "Tags is required"],
      },
    ],
  },
  { timestamps: true }
);

artSchema.pre("save", async function (next) {
  const slug = slugify(this.title, { lower: true, strict: true });

  // check if slug already exists increment it
  const art = await model<Art>("Art").findOne({ slug });
  if (art) {
    this.slug = `${slug}-${new Date().getTime()}`;

    return next();
  }

  this.slug = slug;
  next();
});

// populate category and tags
artSchema.pre(/^find/, function (next) {
  this.populate("category tags", "name");
  next();
});

export default model<Art>("Art", artSchema);
