const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  addPropertyController,
  getAllOwnerPropertiesController,
  deletePropertyController,
  updatePropertyController,
  getAllBookingsController,
  handleBookingStatusController,
} = require("../controllers/ownerController");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    // Add timestamp to filename to prevent overwriting files with the same name
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({ storage: storage });

// POST || /api/owner/postproperty
router.post("/postproperty", authMiddleware, upload.array("propertyImages", 10), addPropertyController); // Limit to 10 images

// GET || /api/owner/getallproperties
router.get("/getallproperties", authMiddleware, getAllOwnerPropertiesController);

// GET || /api/owner/getallbookings
router.get("/getallbookings", authMiddleware, getAllBookingsController);

// POST || /api/owner/handlebookingstatus
router.post("/handlebookingstatus", authMiddleware, handleBookingStatusController);

// DELETE || /api/owner/deleteproperty/:propertyid
router.delete("/deleteproperty/:propertyid", authMiddleware, deletePropertyController);

// PATCH || /api/owner/updateproperty/:propertyid
router.patch("/updateproperty/:propertyid", authMiddleware, upload.array("propertyImages", 10), updatePropertyController);

module.exports = router;