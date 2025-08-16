const express = require('express');
const router = express.Router();
const authenticate = require("../middelware/authenticate");

const stripe = require("stripe")(process.env.STRIPE_SEC_KEY);
const {v4 : uuidv4} = require('uuid');

const Rentbike = require('../models/rentbikeSchema');

module.exports = router.post('/stripePay', authenticate, async (req, res, next) => {
    try {
        console.log('Stripe payment request received');
        console.log('Request body:', req.body);
        
        const {token, amount} = req.body;
        const idempotencyKey = uuidv4();

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const charge = await stripe.charges.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: 'Bike Purchase Payment',
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, {idempotencyKey});

        console.log('Payment successful:', charge.id);

        res.status(200).json({
            success: true,
            message: 'Payment successful',
            charge: charge
        });

    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment failed. Please try again.',
            error: error.message
        });
    }
});
