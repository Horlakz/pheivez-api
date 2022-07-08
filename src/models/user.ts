import { Document, Model, Schema, HydratedDocument, model } from "mongoose";
import bcrypt from "bcryptjs";

interface User extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserMethods {
  matchPassword: (password: string) => Promise<boolean>;
}

interface UserModel extends Model<User, {}, UserMethods> {
  matchPassword: (password: string) => Promise<boolean>;
  userExists(email: string): Promise<HydratedDocument<User, UserMethods>>;
}

const userSchema = new Schema<User, UserModel, UserMethods>(
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: 30,
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

userSchema.pre<User>("save", async function (next) {
  // get the current date and save it to the updatedAt field
  this.updatedAt = new Date();

  // create a salt and hash the password
  if (!this.isModified("password")) {
    return next();
  }
  const salt: string = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.userExists = function (email: string) {
  return this.exists({ email });
};

userSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default model<User, UserModel>("User", userSchema);
