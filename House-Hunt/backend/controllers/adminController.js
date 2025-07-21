const Property = require("../schemas/propertyModel");
const User = require("../schemas/userModel");
const Booking = require("../schemas/bookingModel");

const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await User.find({}).select("-password"); // Exclude passwords
    return res.status(200).send({
      success: true,
      message: "All users fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    console.log("Error in getAllUsersController: ", error);
    res.status(500).send({ success: false, message: "Error fetching users" });
  }
};

const handleStatusController = async (req, res) => {
  try {
    const { userid, status } = req.body;
    const user = await User.findByIdAndUpdate(userid, { granted: status }, { new: true });
    
    if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
    }
    return res.status(200).send({
      success: true,
      message: `User access has been ${status}`,
    });
  } catch (error) {
    console.log("Error in handleStatusController: ", error);
    res.status(500).send({ success: false, message: "Error updating user status" });
  }
};

const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await Property.find({});
    return res.status(200).send({
      success: true,
      message: "All properties fetched successfully",
      data: allProperties,
    });
  } catch (error) {
    console.log("Error in getAllPropertiesController: ", error);
    res.status(500).send({ success: false, message: "Error fetching properties" });
  }
};

const getAllBookingsController = async (req, res) => {
  try {
    const allBookings = await Booking.find({}).populate('propertyId', 'propertyAddress').populate('userID', 'name').populate('ownerID', 'name');
    return res.status(200).send({
      success: true,
      message: "All bookings fetched successfully",
      data: allBookings,
    });
  } catch (error) {
    console.log("Error in getAllBookingsController: ", error);
    res.status(500).send({ success: false, message: "Error fetching bookings" });
  }
};

module.exports = {
  getAllUsersController,
  handleStatusController,
  getAllPropertiesController,
  getAllBookingsController,
};