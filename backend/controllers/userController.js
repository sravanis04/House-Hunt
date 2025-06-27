const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Corrected path
const Property = require("../models/propertyModel"); // Corrected path
const Booking = require("../models/bookingModel"); // Corrected path

const registerController = async (req, res) => {
  try {
    const { email, password, type, name } = req.body;
    if (!email || !password || !type || !name) {
        return res.status(400).send({ message: "All fields are required", success: false });
    }

    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(400).send({ message: "User with this email already exists", success: false });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUserPayload = { ...req.body, password: hashedPassword };

    // Set 'granted' status only for Owners
    if (type === "Owner") {
      newUserPayload.granted = "ungranted";
    }

    const newUser = new User(newUserPayload);
    await newUser.save();

    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    console.error("Error in registerController: ", error); // Use console.error for errors
    res.status(500).send({ success: false, message: `Register Controller Error: ${error.message}` });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid email or password", success: false });
    }

    if (user.type === 'Owner' && user.granted !== 'granted') {
      return res.status(403).send({ message: "Your owner account is pending admin approval.", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
    const userToSend = user.toObject(); // Convert to plain object to remove password
    delete userToSend.password;

    return res.status(200).send({
      message: "Login successful",
      success: true,
      token,
      user: userToSend,
    });
  } catch (error) {
    console.error("Error in loginController: ", error);
    res.status(500).send({ success: false, message: `Login Controller Error: ${error.message}` });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate({ email }, { password: hashedPassword });
    if (!updatedUser) {
      return res.status(404).send({ message: "User with this email not found", success: false });
    }

    res.status(200).send({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error("Error in forgotPasswordController: ", error);
    res.status(500).send({ success: false, message: `Forgot Password Error: ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error("Error in authController: ", error);
    res.status(500).send({ message: "Authentication error", success: false });
  }
};

const getAllPropertiesController = async (req, res) => {
  try {
    // Only show available properties on the public listing
    const allProperties = await Property.find({ isAvailable: 'Available' });
    res.status(200).send({ success: true, data: allProperties });
  } catch (error) {
    console.error("Error in getAllPropertiesController (user): ", error);
    res.status(500).send({ message: "Error fetching properties", success: false });
  }
};

const bookingHandleController = async (req, res) => {
    try {
      const { propertyid } = req.params;
      const { userDetails, ownerId } = req.body;
  
      // Check if property exists
      const property = await Property.findById(propertyid);
      if (!property) {
        return res.status(404).send({ success: false, message: "Property not found." });
      }
  
      // Check if user has already booked this property
      const existingBooking = await Booking.findOne({ propertyId: propertyid, userID: req.body.userId });
      if (existingBooking) {
        return res.status(400).send({ success: false, message: "You have already sent a booking request for this property." });
      }
  
      const newBooking = new Booking({
        propertyId: propertyid,
        userID: req.body.userId,
        ownerID: ownerId, 
        userName: userDetails.fullName,
        phone: userDetails.phone,
        bookingStatus: 'pending',
      });
  
      await newBooking.save();
      res.status(201).send({ success: true, message: "Booking request sent successfully" });
    } catch (error) {
      console.error("Error in bookingHandleController:", error);
      res.status(500).send({ success: false, message: "Error handling booking request" });
    }
  };
  
const getUserBookingsController = async (req, res) => {
  try {
    const { userId } = req.body;
    const userBookings = await Booking.find({ userID: userId }).populate('propertyId', 'propertyAddress propertyAmt');
    
    res.status(200).send({ success: true, data: userBookings });
  } catch (error) {
    console.error("Error in tenant's getUserBookingsController: ", error);
    res.status(500).send({ message: "Internal server error", success: false });
  }
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getUserBookingsController,
};