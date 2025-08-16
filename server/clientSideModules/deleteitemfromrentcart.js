const express = require('express');
const router = express.Router();
const authenticate = require("../middelware/authenticate");

const User = require('../models/userSchema');
const Rentcart = require('../models/rentcartSchema');

module.exports = router.post('/deleteitemfromrentcart', authenticate, async (req, res) => {
    try {
        const { cartitemid } = req.body;
        
        if (!cartitemid) {
            return res.status(400).json({ 
                success: false, 
                message: "Cart item ID is required" 
            });
        }

        const findUser = await User.findOne({_id: req.userID});
        const findUserById = findUser._id;

        // Find the user's rent cart
        const userRentCart = await Rentcart.findOne({userById: findUserById});
        
        if (!userRentCart) {
            return res.status(404).json({ 
                success: false, 
                message: "Rent cart not found" 
            });
        }

        // Find the item in rent cart
        const itemIndex = userRentCart.cartItems.findIndex(item => 
            item._id.toString() === cartitemid
        );

        if (itemIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: "Item not found in rent cart" 
            });
        }

        // Remove the item from rent cart
        userRentCart.cartItems.splice(itemIndex, 1);
        
        // If cart is empty, delete the entire cart document
        if (userRentCart.cartItems.length === 0) {
            await Rentcart.deleteOne({_id: userRentCart._id});
            return res.status(200).json({ 
                success: true, 
                message: "Item removed from cart successfully. Cart is now empty.",
                cart: null
            });
        } else {
            // Save the updated cart
            await userRentCart.save();
            return res.status(200).json({ 
                success: true, 
                message: "Item removed from cart successfully",
                cart: userRentCart
            });
        }

    } catch (error) {
        console.error('Delete rent cart item error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to remove item from cart. Please try again." 
        });
    }
});
