const express = require('express');
const router = express.Router();
const authenticate = require("../middelware/authenticate");

const User = require('../models/userSchema');
const Cart = require('../models/cartSchema');

module.exports = router.get('/getCartData', authenticate, async (req, res) => {
    try {
        console.log('Get cart data request received');
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
        
        if (!userCart) {
            // Return empty cart instead of error
            return res.status(200).json({
                success: true,
                userById: findUserById,
                cartItems: []
            });
        }

        console.log('Cart items count:', userCart.cartItems.length);

        res.status(200).json({
            success: true,
            userById: userCart.userById,
            cartItems: userCart.cartItems
        });

    } catch (error) {
        console.error('Get cart data error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to get cart data. Please try again." 
        });
    }
});
