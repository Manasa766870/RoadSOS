const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const createTestUser = async () => {
  try {
    await connectDB();

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@roadsos.com' });
    if (existingUser) {
      console.log('Test user already exists');
      process.exit(0);
    }

    // Create test user
    const user = new User({
      name: 'Test User',
      email: 'test@roadsos.com',
      password: 'test123456',
    });

    await user.save();

    console.log('✅ Test user created successfully!');
    console.log('Email: test@roadsos.com');
    console.log('Password: test123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
