const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ // Changed to userSchema
  name: {
    type: String,
    required: [true, "Name is required"],
    set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  type: {
    type: String,
    required: [true, "User type is required"],
    enum: ['Admin', 'Owner', 'Renter']
  },
  granted: { // Specifically for owners
    type: String,
    enum: ['granted', 'ungranted', null],
    default: null,
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema); // Use singular "User" as convention

module.exports = User;