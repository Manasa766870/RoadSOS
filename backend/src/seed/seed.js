const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('../models/Service');
const connectDB = require('../config/db');

dotenv.config({ path: '../../.env' }); // Adjust if .env is in root or backend

connectDB();

const mockServices = [
  {
    name: 'City General Hospital',
    type: 'Hospital',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] }, // Bangalore
    contactNumber: '+91 9876543210',
    address: '123 Health St, BLR',
    isOpen: true
  },
  {
    name: 'Rapid Response Ambulance',
    type: 'Ambulance',
    location: { type: 'Point', coordinates: [77.5900, 12.9700] },
    contactNumber: '+91 8888888888',
    isOpen: true
  },
  {
    name: 'Central Police Station',
    type: 'Police Station',
    location: { type: 'Point', coordinates: [77.6000, 12.9800] },
    contactNumber: '100',
    isOpen: true
  },
  {
    name: 'Safe Towing Services',
    type: 'Towing',
    location: { type: 'Point', coordinates: [77.5850, 12.9650] },
    contactNumber: '+91 9999999999',
    isOpen: true
  }
];

const importData = async () => {
  try {
    await Service.deleteMany();
    await Service.insertMany(mockServices);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
