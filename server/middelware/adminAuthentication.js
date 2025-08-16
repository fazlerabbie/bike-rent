const jwt = require("jsonwebtoken");
const Admin = require('../models/adminSchema');

const adminAuthentication = async (req, res, next) =>{

    try {

        const token = req.cookies.jwtAdmin;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootAdmin = await Admin.findOne({_id: verifyToken._id, "tokens.token":token});

        if(!rootAdmin){ throw new Error('Admin not found')}

        req.token = token;
        req.rootAdmin = rootAdmin;
        req.adminID = rootAdmin._id;

        next();

    } catch (error) {
        console.log('Admin authentication error:', error.message);
        res.status(401).json({
            success: false,
            error: 'Unauthorized: Admin login required'
        });
    }
}

module.exports = adminAuthentication
