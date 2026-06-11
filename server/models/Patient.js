const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    defaultCity: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
