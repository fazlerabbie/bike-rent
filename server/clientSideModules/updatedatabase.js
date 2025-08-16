const express = require('express');
const router = express.Router();
const authenticate = require("../middelware/authenticate");

const User = require('../models/userSchema');
const Cart = require('../models/cartSchema');
const Rentbike = require('../models/rentbikeSchema');

module.exports = router.post('/updateDataBase', authenticate, async (req, res) => {
    try {
        console.log('Update database request received');
        console.log('User ID from auth:', req.userID);
        
        const findUser = await User.findOne({_id: req.userID});
        if (!findUser) {
            console.log('User not found:', req.userID);
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        console.log('Found user:', findUser._id);
        const findUserById = findUser._id;

        // Find the user's cart
        const userCart = await Cart.findOne({userById: findUserById});
        console.log('User cart found:', userCart ? 'Yes' : 'No');
        
        if (!userCart || userCart.cartItems.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No items in cart to process" 
            });
        }

        // Process each item in the cart
        for (const item of userCart.cartItems) {
            // Update bike quantity or mark as sold
            const bike = await Rentbike.findById(item.product);
            if (bike) {
                // You can add logic here to update bike availability
                // For example, reduce quantity or mark as sold
                console.log(`Processing purchase for bike: ${bike.brand} ${bike.model}`);
            }
        }

        // Clear the cart after successful purchase
        await Cart.deleteOne({_id: userCart._id});
        console.log('Cart cleared after successful purchase');

        res.status(200).json({
            success: true,
            message: 'Database updated successfully. Purchase completed.',
            processedItems: userCart.cartItems.length
        });

    } catch (error) {
        console.error('Update database error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update database. Please try again." 
        });
    }
});
