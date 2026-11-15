
import Medicine from "../models/Medicine.js";

// Allowed medicine fields
const allowedFields = [
  "name",
  "genericName",
  "brand",
  "company",
  "category",
  "subcategory",
  "price",
  "mrp",
  "images",
  "composition",
  "packSize",
  "stock",
  "batchNumber",
  "expiryDate",
  "dosage",
  "precautions",
  "description",
  "uses",
  "routine",
  "status",
  "isActive",
  "generic",
  "pack",
  "image"
];

// Prepare medicine data
const prepareMedicineData = (body) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  // Old field compatibility
  if (data.genericName === undefined && body.generic !== undefined) {
    data.genericName = body.generic;
  }

  if (data.packSize === undefined && body.pack !== undefined) {
    data.packSize = body.pack;
  }

  // Support old single image
  if (data.images === undefined && body.image) {
    data.images = [body.image];
  }

  return data;
};

// Get all medicines
export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({
      createdAt: -1
    });

    res.json({
      success: true,
      count: medicines.length,
      medicines
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single medicine
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.json({
      success: true,
      medicine
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add medicine
export const addMedicine = async (req, res) => {
  try {
    const medicineData = prepareMedicineData(req.body);

    const medicine = await Medicine.create(medicineData);

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      medicine
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update medicine
export const updateMedicine = async (req, res) => {
  try {
    const medicineData = prepareMedicineData(req.body);

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      {
        $set: medicineData
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.json({
      success: true,
      message: "Medicine updated successfully",
      medicine
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(
      req.params.id
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.json({
      success: true,
      message: "Medicine deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

