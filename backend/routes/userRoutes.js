const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getUserBookingsController,
} = require("../controllers/userController");

const router = express.Router();

// --- PUBLIC ROUTES ---
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgotpassword", forgotPasswordController);
router.get('/getAllProperties', getAllPropertiesController);

// --- PROTECTED ROUTES (Require Authentication) ---
router.post("/getuserdata", authMiddleware, authController);
router.post("/bookinghandle/:propertyid", authMiddleware, bookingHandleController);
router.get('/getmybookings', authMiddleware, getUserBookingsController);

module.exports = router;