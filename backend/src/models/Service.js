const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Hospital', 'Trauma Center', 'Ambulance', 'Police Station', 'Towing', 'Puncture Shop', 'Rescue'],
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  contactNumber: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  address: {
    type: String,
  }
}, { timestamps: true });

// Ensure a 2dsphere index is on the location for GeoSpatial queries
serviceSchema.index({ location: '2dsphere' });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
