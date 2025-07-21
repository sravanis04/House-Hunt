const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({ // Changed to propertySchema
   ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   ownerName: {
      type: String,
      required: true,
   },
   ownerContact: {
      type: Number,
      required: [true, 'Please provide owner contact'],
   },
   propertyType: {
      type: String,
      required: [true, 'Please provide a Property Type'],
   },
   propertyAdType: {
      type: String,
      required: [true, 'Please provide a Property Ad Type'],
   },
   propertyAddress: {
      type: String,
      required: [true, "Please provide an Address"],
   },
   propertyAmt: {
      type: Number,
      default: 0,
   },
   propertyImage: {
      type: Array, // Array of objects like { filename, path }
      default: [],
   },
   additionalInfo: {
      type: String,
   },
   isAvailable: {
      type: String,
      default: 'Available',
   },
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema); // Use singular "Property"

module.exports = Property;