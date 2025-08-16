const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import Admin model
const Admin = require('./models/adminSchema');

// Connect to database
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
    seedAdmin();
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
    process.exit(1);
  });

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ adminName: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create default admin user
    const admin = new Admin({
      adminName: 'admin',
      email: 'admin@bikebook.com',
      phone: '1234567890',
      adminPassword: 'admin123',
      cPassword: 'admin123'
    });

    await admin.save();
    console.log('Default admin user created successfully');
    console.log('Admin credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@bikebook.com');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}
