const express = require('express');
const router = express.Router();
const adminAuthentication = require("../middelware/adminAuthentication");

const User = require('../models/userSchema');

module.exports = router.post('/deleteUserfromdashboard', adminAuthentication, async (req, res) => {
    try {
        const { userIdFromDashBoard } = req.body;

        if (!userIdFromDashBoard) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const deletedUser = await User.findOneAndDelete({ _id: userIdFromDashBoard });

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            deletedUser: deletedUser
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to delete user. Please try again."
        });
    }
});