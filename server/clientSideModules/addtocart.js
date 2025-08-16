const express = require('express');
const router = express.Router();
const authenticate = require("../middelware/authenticate");

const User = require('../models/userSchema');
const Rentbike = require('../models/rentbikeSchema');
const Cart = require('../models/cartSchema');

module.exports = router.post('/addtocart', authenticate, async(req, res) => {
    try {
        console.log('Add to cart request received');
        console.log('Request body:', req.body);
        console.log('User ID from auth:', req.userID);
        
        const { itemId, quantity = 1 } = req.body;
        
        if (!itemId) {
            return res.status(400).json({ 
                success: false, 
                message: "Item ID is required" 
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
        
        const findUserById = findUser._id;
        const findItem = await Rentbike.findOne({_id: itemId});
        
        if (!findItem) {
            return res.status(404).json({ 
                success: false, 
                message: "Bike not found" 
            });
        }
        
        const itemPrice = parseInt(findItem.price);
        const itemById = findItem._id;
        const itemBrand = findItem.brand;
        const itemModel = findItem.model;

        console.log('Found bike:', itemBrand, itemModel, 'Price:', itemPrice);

        let loginUser = await Cart.findOne({userById: findUserById});
        
        if (loginUser) {
            // Check if item already exists in cart
            const existingItemIndex = loginUser.cartItems.findIndex(item => 
                item.product.toString() === itemById.toString()
            );
            
            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                loginUser.cartItems[existingItemIndex].quantity += quantity;
                console.log('Updated existing item quantity');
            } else {
                // Add new item to cart
                loginUser.cartItems.push({
                    product: itemById,
                    quantity: quantity,
                    price: itemPrice,
                    brand: itemBrand,
                    model: itemModel
                });
                console.log('Added new item to cart');
            }
            
            await loginUser.save();
            return res.status(200).json({
                success: true,
                message: "Item added to cart successfully",
                cart: loginUser
            });
        } else {
            // Create new cart
            const newCart = new Cart({
                userById: findUserById,
                cartItems: [{
                    product: itemById,
                    quantity: quantity,
                    price: itemPrice,
                    brand: itemBrand,
                    model: itemModel
                }]
            });

            await newCart.save();
            console.log('Created new cart with item');

            return res.status(201).json({
                success: true,
                message: "Item added to cart successfully",
                cart: newCart
            });
        }

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to add item to cart. Please try again." 
        });
    }
});
