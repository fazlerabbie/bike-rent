const express = require('express');
const router = express.Router();
const authenticate = require("../middelware/authenticate");

const User = require('../models/userSchema');
const Cart = require('../models/cartSchema');

module.exports = router.post('/deleteitemfromcart', authenticate, async (req, res) => {
    try {
        console.log('Delete cart item request received');
        console.log('Request body:', req.body);
        console.log('User ID from auth:', req.userID);

        const { cartitemid } = req.body;

        if (!cartitemid) {
            console.log('No cart item ID provided');
            return res.status(400).json({
                success: false,
                message: "Cart item ID is required"
            });
        }

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
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        console.log('Cart items count:', userCart.cartItems.length);
        console.log('Looking for item ID:', cartitemid);

        // Find the item in cart
        const itemIndex = userCart.cartItems.findIndex(item =>
            item._id.toString() === cartitemid
        );

        console.log('Item index found:', itemIndex);

        if (itemIndex === -1) {
            console.log('Item not found in cart');
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        // Remove the item from cart
        userCart.cartItems.splice(itemIndex, 1);
        console.log('Item removed, remaining items:', userCart.cartItems.length);

        // Save the updated cart
        await userCart.save();
        console.log('Cart saved successfully');

        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cart: userCart
        });

    } catch (error) {
        console.error('Delete cart item error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to remove item from cart. Please try again."
        });
    }
});
