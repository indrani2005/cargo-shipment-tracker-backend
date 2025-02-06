import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema({
  shipmentID: { type: String, required: true, unique: true },
  containerID: { type: String, required: true },
  route: [
    {
      city: String,
      coordinates: { lat: Number, lng: Number },
    },
  ],
  currentLocation: {
    city: String,
    coordinates: { lat: Number, lng: Number },
  },
  currentETA: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "In Transit", "Delivered"], 
    required: true 
  },
});


const Shipment = mongoose.model("Shipment", ShipmentSchema);
export default Shipment;
