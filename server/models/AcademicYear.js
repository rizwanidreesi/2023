const mongoose = require("mongoose");
const validator = require("validator");


const academicYearSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fromYear: {
      type: Date,
      required: true,
      // format: 'MM-YYYY',
    },
    toYear: {
      type: Date,
      required: true,
      // format: 'MM-YYYY',
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    //Finance
    //Librarian
    //......
  },
  {
    timestamps: true,
  }
);

academicYearSchema.pre("save", async function (next) {
  if (this.fromYear > this.toYear) {
    const err = new Error('From Year must be less than or equal to the To Year.');
    return next(err);
  }
  next();
});

//model
module.exports =  mongoose.model("AcademicYear", academicYearSchema);


