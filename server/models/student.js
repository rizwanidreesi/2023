const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [40, "Name must be less than 40 characters"],
    },
    email: {
      type: String,
      //   required: [true, "Email is required"],
      //   unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      //   required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      default: "student",
    },
    studentId: {
      type: String,
      required: true,
      default: function () {
        return (
          "STU" +
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
    stPicture: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    classLevels:{
        type: String,
        required: true,

    },
    dateofBirth: {
      type: Date,
    },
    gender: {
      type: String,
    
    },
    nationality: {
      type: String,
    },
    religion: {
      type: String,
    },
    placeOfBirth: {
      type: String,
    },
    postalAddress: {
      type: String,
    },
    telephone: {
      type: String,
    },
    mobilenumber: {
      type: String,
    },
    guadian: {
      type: [
        {
          id: String,
          relationship: String,
          occupation: String,
          name: String,
          email: String,
          mobile: String,
          address: String,
          lastname: String,
        },
      ],
    },
    health: {
      type: String,
    },
    allege: {
      type: String,
    },
    disease: {
      type: String,
    },
    section: {
      type: String,
    },
    division: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    //   required: true,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypting password before saving user
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// check if password is correct
studentSchema.methods.correctPassword = async function (
  candidatePassword,
  studentPassword
) {
  return await bcrypt.compare(candidatePassword, studentPassword);
};

// Return JWT token on successful login
studentSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Generate password reset token
studentSchema.methods.getResetPasswordToken = function () {
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

module.exports = mongoose.model("Student", studentSchema);
