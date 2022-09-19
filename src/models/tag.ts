import { Document, model, Schema } from "mongoose";

interface Tag extends Document {
  name: string;
}

const tagSchema = new Schema<Tag>(
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

tagSchema.pre("save", async function (next) {
  this.name = this.name.toLowerCase();
  next();
});

export default model<Tag>("Tag", tagSchema);
