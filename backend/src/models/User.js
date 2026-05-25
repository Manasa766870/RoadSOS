const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ContactSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },

    name: {
      type: String,
      default: '',
    },

    photo: {
      type: String,
      default: '',
    },

    address: {
      type: String,
      default: '',
    },

    bloodGroup: {
      type: String,
      default: '',
    },

    allergies: {
      type: String,
      default: '',
    },

    medications: {
      type: String,
      default: '',
    },

    medicalNotes: {
      type: String,
      default: '',
    },

    emergencyContacts: {
      type: [ContactSchema],
      default: [
        {
          id: 1,
          name: 'Jane Doe (Wife)',
          phone: '+919876543210',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  // Only hash if password modified
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt
  const salt = await bcrypt.genSalt(10);

  // Hash password
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);