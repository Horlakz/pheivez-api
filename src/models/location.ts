import { model, Schema, Document } from "mongoose";

interface Country extends Document {
  name: string;
  available: boolean;
}

interface State extends Document {
  name: string;
  country: Schema.Types.ObjectId;
  available: boolean;
}

interface City extends Document {
  name: string;
  state: Schema.Types.ObjectId;
  available: boolean;
}

const countrySchema = new Schema<Country>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    available: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const stateSchema = new Schema<State>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: [true, "Country is required"],
    },
    available: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const citySchema = new Schema<City>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    // state: {
      // type: Schema.Types.ObjectId,
      // ref: "State",
      // required: [true, "State is required"],
    // },
    available: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Country = model<Country>("Country", countrySchema);
export const State = model<State>("State", stateSchema);
export const City = model<City>("City", citySchema);
