import express from "express";
import { getShipments, getShipment, updateLocation, getETA, createShipment } from "../controllers/shipmentController.js";

const router = express.Router();

// Routes
router.get("/", getShipments);                // Get all shipments
router.get("/:id", getShipment);              // Get a specific shipment by ID
router.post("/:id/update-location", updateLocation); // Update shipment location
router.get("/:id/eta", getETA);               // Get ETA of a shipment
router.post("/", createShipment);             // Create a new shipment

export default router;

