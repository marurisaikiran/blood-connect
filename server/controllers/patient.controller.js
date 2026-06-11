const Patient = require("../models/Patient");

// GET /api/patients/me
const getMyProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient profile not found" });
    }
    res.json({ success: true, patient });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/patients/me
const updateMyProfile = async (req, res, next) => {
  try {
    const { age, gender, defaultCity } = req.body;
    const patient = await Patient.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { age, gender, defaultCity } },
      { new: true, runValidators: true }
    );
    res.json({ success: true, patient });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyProfile, updateMyProfile };
