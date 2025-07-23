const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { 
    getAllUsersController, 
    handleStatusController, 
    getAllPropertiesController, 
    getAllBookingsController 
} = require("../controllers/adminController");

const router = express.Router();

// GET || /api/admin/getallusers
router.get('/getallusers', authMiddleware, getAllUsersController);

// POST || /api/admin/handlestatus
router.post('/handlestatus', authMiddleware, handleStatusController);

// GET || /api/admin/getallproperties
router.get('/getallproperties', authMiddleware, getAllPropertiesController);

// GET || /api/admin/getallbookings
router.get('/getallbookings', authMiddleware, getAllBookingsController);

module.exports = router;