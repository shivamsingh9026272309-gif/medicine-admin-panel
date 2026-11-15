
import express from "express";

import {
  getMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine
} from "../controllers/medicineController.js";

const router = express.Router();

// Get all medicines
router.get("/", getMedicines);

// Get medicine by ID
router.get("/:id", getMedicineById);

// Add new medicine
router.post("/", addMedicine);

// Update medicine
router.put("/:id", updateMedicine);

// Delete medicine
router.delete("/:id", deleteMedicine);

export default router;

