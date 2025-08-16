const express = require('express');
const router = express.Router();
const adminAuthentication = require("../middelware/adminAuthentication");

const Rentbike = require('../models/rentbikeSchema');

const multer = require("multer");

const upload = multer({ dest: 'uploads/' });



module.exports = router.post('/addrentbikes', adminAuthentication, upload.single("myrentfile"),  async(req, res, next)=>{

    try {
            console.log('Add rent bike request received');
            console.log('Request body:', req.body);
            console.log('File info:', req.file ? {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            } : 'No file');

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "No image file uploaded"
                });
            }

            // Validate required fields
            const requiredFields = ['brand', 'model', 'year', 'color', 'seats', 'price', 'rent'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        success: false,
                        error: `${field} is required`
                    });
                }
            }

            const data = new Rentbike({
                brand : req.body.brand,
                model : req.body.model,
                year : req.body.year,
                color : req.body.color,
                seats : req.body.seats,
                price : req.body.price,
                rent : req.body.rent,
                fileName : req.file.originalname,
                filePath : req.file.path,
                fileType : req.file.mimetype,
                fileSize : req.file.size,
            });

            await data.save();
            console.log('Rent bike saved successfully:', data._id);

            res.status(200).json({
                success: true,
                message: "Rent bike added successfully",
                bikeId: data._id
            });
    } catch (error) {
        console.error('Add rent bike error:', error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to add rent bike"
        });
    }

} )