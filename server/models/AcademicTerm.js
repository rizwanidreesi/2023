const mongoose = require("mongoose");

const academicTermSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Academic Term Name is required"],
      trim: true,
      unique: true,
      maxlength: [10, "Name must be less than 10 characters"],
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
      default: "4 months",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const AcademicTerm = mongoose.model("AcademicTerm", academicTermSchema);

module.exports = AcademicTerm;
