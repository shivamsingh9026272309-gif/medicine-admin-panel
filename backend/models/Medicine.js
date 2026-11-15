
import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    // Medicine Name
    name: {
      type: String,
      required: true,
      trim: true
    },

    // Generic Name
    genericName: {
      type: String,
      default: ""
    },

    // Brand Name
    brand: {
      type: String,
      default: ""
    },

    // Company Name
    company: {
      type: String,
      default: ""
    },

    // Category
    category: {
      type: String,
      required: true,
      trim: true
    },

    // Subcategory
    subcategory: {
      type: String,
      default: ""
    },

    // Selling Price
    price: {
      type: Number,
      required: true,
      min: 0
    },

    // MRP
    mrp: {
      type: Number,
      required: true,
      min: 0
    },

    // 3 Product Images
    images: {
      type: [String],
      default: []
    },

    // Composition
    composition: {
      type: String,
      default: ""
    },

    // Pack Size
    packSize: {
      type: String,
      default: ""
    },

    // Stock Quantity
    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    // Batch Number
    batchNumber: {
      type: String,
      default: ""
    },

    // Expiry Date
    expiryDate: {
      type: Date,
      default: null
    },

    // Dosage
    dosage: {
      type: String,
      default: ""
    },

    // Precautions
    precautions: {
      type: String,
      default: ""
    },

    // Old fields - backward compatibility
    generic: {
      type: String,
      default: ""
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

    routine: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    },

    isActive: {
      type: Boolean,
      default: true
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

