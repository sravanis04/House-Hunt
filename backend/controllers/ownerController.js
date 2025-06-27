const Booking = require("../schemas/bookingModel");
const Property = require("../schemas/propertyModel");
const User = require("../schemas/userModel");

const addPropertyController = async (req, res) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      }));
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
        return res.status(404).send({ success: false, message: "Owner not found" });
    }

    const newPropertyData = new Property({
      ...req.body,
      propertyImage: images,
      ownerId: user._id,
      ownerName: user.name,
      isAvailable: "Available",
    });

    await newPropertyData.save();

    return res.status(201).send({
      success: true,
      message: "New property has been added successfully",
    });
  } catch (error) {
    console.log("Error in addPropertyController: ", error);
    res.status(500).send({ success: false, message: "Error adding property" });
  }
};

const getAllOwnerPropertiesController = async (req, res) => {
  try {
    const { userId } = req.body;
    const ownerProperties = await Property.find({ ownerId: userId });
    
    return res.status(200).send({ success: true, data: ownerProperties });
  } catch (error) {
    console.error("Error in getAllOwnerPropertiesController: ", error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};

const deletePropertyController = async (req, res) => {
  try {
    const { propertyid } = req.params;
    const property = await Property.findOneAndDelete({ _id: propertyid, ownerId: req.body.userId });

    if (!property) {
      return res.status(404).send({ success: false, message: "Property not found or you are not authorized to delete it." });
    }

    return res.status(200).send({ success: true, message: "The property has been deleted" });
  } catch (error) {
    console.error("Error in deletePropertyController: ", error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};

const updatePropertyController = async (req, res) => {
  try {
    const { propertyid } = req.params;
    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
            filename: file.filename,
            path: `/uploads/${file.filename}`,
        }));
        updateData.propertyImage = newImages;
    }

    const property = await Property.findOneAndUpdate(
      { _id: propertyid, ownerId: req.body.userId },
      updateData,
      { new: true }
    );
    
    if (!property) {
        return res.status(404).send({ success: false, message: "Property not found or you are not the owner." });
    }

    return res.status(200).send({
      success: true,
      message: "Property updated successfully.",
      data: property
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({ success: false, message: "Failed to update property." });
  }
};

const getAllBookingsController = async (req, res) => {
  try {
    const { userId } = req.body; // This is the owner's ID
    const ownerBookings = await Booking.find({ ownerID: userId }).populate('userID', 'name email');
    
    return res.status(200).send({ success: true, data: ownerBookings });
  } catch (error) {
    console.error("Error in owner's getAllBookingsController: ", error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};

const handleBookingStatusController = async (req, res) => {
  try {
    const { bookingId, propertyId, status } = req.body;
    
    const booking = await Booking.findOneAndUpdate(
        { _id: bookingId, ownerID: req.body.userId },
        { bookingStatus: status },
        { new: true }
    );

    if (!booking) {
        return res.status(404).send({ success: false, message: "Booking not found or you are not the owner." });
    }

    if (status === 'booked') {
        await Property.findByIdAndUpdate(propertyId, { isAvailable: 'Unavailable' });
    } else if (status === 'cancelled' || status === 'rejected') {
        await Property.findByIdAndUpdate(propertyId, { isAvailable: 'Available' });
    }

    return res.status(200).send({
      success: true,
      message: `Booking status changed to ${status}`,
    });
  } catch (error) {
    console.error("Error in handleBookingStatusController: ", error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};

module.exports = {
  addPropertyController,
  getAllOwnerPropertiesController,
  deletePropertyController,
  updatePropertyController,
  getAllBookingsController,
  handleBookingStatusController,
};