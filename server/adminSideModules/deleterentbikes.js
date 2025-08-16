const express = require('express');
const router = express.Router();
const adminAuthentication = require("../middelware/adminAuthentication");

const Rentbike = require('../models/rentbikeSchema');

module.exports = router.post('/deleteRentBikeFromDashboard', adminAuthentication, async (req, res) => {
    try {
        const { bikeIdFromDashBoard } = req.body;

        if (!bikeIdFromDashBoard) {
            return res.status(400).json({
                success: false,
                message: "Bike ID is required"
            });
        }

        const deletedBike = await Rentbike.findOneAndDelete({ _id: bikeIdFromDashBoard });

        if (!deletedBike) {
            return res.status(404).json({
                success: false,
                message: "Bike not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Bike deleted successfully",
            deletedBike: deletedBike
        });

    } catch (error) {
        console.error('Delete bike error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to delete bike. Please try again."
        });
    }
});