
import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    generic: {
      type: String,
      default: ""
    },

    company: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      required: true
    },

    mrp: {
      type: Number,
      required: true,
      min: 0
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    pack: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    uses: {
      type: String,
      default: ""
    },

    dosage: {
      type: String,
      default: ""
    },

    precautions: {
      type: String,
      default: ""
    },

    routine: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

const Medicine = mongoose.model(
  "Medicine",
  medicineSchema
);

export default Medicine;
