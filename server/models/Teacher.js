const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { type } = require("os");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [40, "Name must be less than 40 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    cnic: {
      type: Number,
      required: [true, "CNIC is required"],
      minlength: [14, "CNIC must be of 14 Numbers"],
      maxlength: [14, "CNIC must be of 14 Numbers"],
      unique: true,
    },
    fatherName: {
      type: String,
    },
    dateEmployed: {
      type: Date,
      default: Date.now,
    },
    teacherId: {
      type: String,
      required: true,
      default: function () {
        return (
          "TEA" +
          Math.floor(100 + Math.random() * 900) +
          Date.now().toString().slice(2, 4) +
          this.name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
        );
      },
    },
    gender:{
      type: String,
      default: "male",
      enum:["male", "female", "others"],
    },
    //if witdrawn, the teacher will not be able to login
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
    //if suspended, the teacher can login but cannot perform any task
    isSuspended: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["teacher", "sectionHead", "vPrincipal", "principal", "accountant"],
      default: "teacher",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      // required: true,
    },
    designation: {
      type: String,
      default: "teacher",
      enum: [
        "teacher",
        "junior Teacher",
        "seniorTeacher",
        "sectionHead",
        "vPrincipal",
        "principal",
        "accountant",
        "peon",
        "aya",
        "janitor",
      ],
    },
    educationBackground:[
      {
        degreeName: {
          type: String
        },
        group:{
          type: String
        },
        boardName:{
          type: String
        },
        passingYear:{
          type: Date
        },
        grades:{
          type: String
        },
      }
    ],
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    program: {
      type: String,
    },
    //A teacher can teach in more than one class level
    classLevel: {
      type: String,
    },
    academicYear: {
      type: String,
    },
    // examsCreated: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Exam",
    //   },
    // ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    academicTerm: {
      type: String,
    },
    monthlySalary:{
      type: Number,
      default: 0,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypting password before saving user
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// check if password is correct
teacherSchema.methods.correctPassword = async function (
  candidatePassword,
  teacherPassword
) {
  return await bcrypt.compare(candidatePassword, teacherPassword);
};

// Return JWT token on successful login
teacherSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Generate password reset token
teacherSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Set resetToken to user
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
//model
module.exports = mongoose.model("Teacher", teacherSchema);
