const express = require('express');
const router = express.Router();
const authenticate = require("../middelware/authenticate");


const User = require('../models/userSchema');
const Rentbike = require('../models/rentbikeSchema');
const Rentcart = require('../models/rentcartSchema');


module.exports = router.post('/addrentcartocart', authenticate, async(req, res)=>{
    try {
        console.log('Add rent cart request received');
        console.log('Request body:', req.body);
        console.log('User ID from auth:', req.userID);

        const getItemId = req.body.itemId;
        const getRentHours = req.body.rentHours;

        // Validation
        if (!getItemId) {
            return res.status(400).json({
                success: false,
                error: "Item ID is required"
            });
        }

        if (!getRentHours || getRentHours <= 0) {
            return res.status(400).json({
                success: false,
                error: "Valid rental hours are required"
            });
        }

        const findUser = await User.findOne({_id: req.userID});
        if (!findUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        const findUserById = findUser._id;
        const findItem = await Rentbike.findOne({_id: getItemId});

        if (!findItem) {
            return res.status(404).json({
                success: false,
                error: "Bike not found"
            });
        }

        const itemPrice = findItem.rent;
        const itemById = findItem._id;
        const itemBrand = findItem.brand;
        const itemModel = findItem.model;

        let loginUser = await Rentcart.findOne({userById: findUserById});
        
        if(loginUser){
            let loginUserId = loginUser.userById;
            let itemIdInCart;
            
            loginUser.cartItems.map((cartItems)=>{
                itemIdInCart= cartItems.rentbikeid;
            })
           
        if(loginUserId){
            
            if(itemById.equals(itemIdInCart)){
                return res.status(400).json({
                    success: false,
                    error: "Item is already in the cart"
                });
            }
            else{
                
                loginUser.cartItems.push({
                    rentbikeid:itemById, 
                    requiredhours:getRentHours, 
                    rentperhour:itemPrice, 
                    totalbill:itemPrice * getRentHours, 
                    brand:itemBrand, 
                    model:itemModel});
            }
            loginUser = await loginUser.save();
            return res.status(200).json({
                success: true,
                message: "Item added to cart successfully",
                cart: loginUser
            });
        }
    }
        else{
            
            const newCart= new Rentcart({
                userById : findUser,
                cartItems: [{
                    rentbikeid:itemById, 
                    requiredhours:getRentHours, 
                    rentperhour:itemPrice, 
                    totalbill:itemPrice * getRentHours, 
                    brand:itemBrand, 
                    model:itemModel
                }]
            });

            await newCart.save();

            return res.status(201).json({
                success: true,
                message: "Item added to cart successfully",
                cart: newCart
            });
        }

    } catch (error) {
        console.error('Add to rent cart error:', error);
        res.status(500).json({
            success: false,
            error: "Something went wrong. Please try again."
        });
    }

   
} )