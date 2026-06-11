const express = require("express");
const { getMyProfile, updateMyProfile } = require("../controllers/patient.controller");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect, authorize("patient"));

router.get("/me", getMyProfile);
router.patch("/me", updateMyProfile);

module.exports = router;
