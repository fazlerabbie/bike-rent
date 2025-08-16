const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Admin = require('../models/adminSchema');

//Admin Registration 
module.exports = router.post('/signupAdmin', async (req, res) =>{
    const {adminName, email, phone, adminPassword, cPassword} = req.body;
    
    if(!adminName || !email || !phone || !adminPassword || !cPassword){
        return res.status(422).json({ error: "Please filled the form properly"})
    }

    try {
            const adminExist = await Admin.findOne({ email: email});
            
            if(adminExist){
                return res.status(422).json({error: "Admin already exists with this email"})
            }
            else if(adminPassword != cPassword){
                return res.status(422).json({error: "Passwords are not matching"})
            }
            else{
                const admin = new Admin ({adminName, email, phone, adminPassword, cPassword});
    
                await admin.save();

                res.status(201).json({ message: "Admin registered successfully"});
            }
    
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Server error during registration"});
    }
});
