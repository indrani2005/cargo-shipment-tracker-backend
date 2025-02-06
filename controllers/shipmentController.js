import Shipment  from "../models/Shipment.js";
import axios from 'axios';

// Function to get directions from OpenRouteService API
const getDirections = async (startCoordinates, endCoordinates) => {
    const apiKey =  process.env.ORS_API_KEY;

    const start = `${startCoordinates.lng},${startCoordinates.lat}`; // Correct format: lng, lat
    const end = `${endCoordinates.lng},${endCoordinates.lat}`; // Correct format: lng, lat

    try {
        const response = await axios.get(
            `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`
        );
        return response.data; // This will contain route details
    } catch (error) {
        console.error("Error fetching directions:", error.message);
        throw error;
    }
};

// Get all shipments
export const getShipments = async (req, res) => {
    const shipments = await Shipment.find();
    res.json(shipments);
};

// Get a specific shipment
export const getShipment = async (req, res) => {
    const shipment = await Shipment.findById(req.params.id);
    res.json(shipment);
};

// Update shipment location
export const updateLocation = async (req, res) => {
    const { city, coordinates } = req.body;
    const updatedShipment = await Shipment.findByIdAndUpdate(
        req.params.id, 
        { currentLocation: { city, coordinates } }, 
        { new: true }
    );
    res.json(updatedShipment);
};

// Get ETA with OpenRouteService
export const getETA = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (!shipment) return res.status(404).json({ msg: "Shipment not found" });

        const origin = shipment.currentLocation.coordinates;
        const destination = shipment.route[shipment.route.length - 1].coordinates;

        // Get the directions from OpenRouteService
        const directions = await getDirections(origin, destination);

        // Assuming the directions API gives the estimated time in the response
        const eta = directions.features[0].properties.segments[0].duration;

        // Convert seconds to a more readable format
        const etaInMinutes = Math.round(eta / 60);
        
        res.json({ eta: `${etaInMinutes} minutes` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new shipment
export const createShipment = async (req, res) => {
    const newShipment = new Shipment(req.body);
    await newShipment.save();
    res.status(201).json(newShipment);
};
