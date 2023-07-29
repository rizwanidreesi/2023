const Student = require("../models/student");
const ClassLevel = require("../models/ClassLevel");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const myEmail = require("../utils/myEmail");
const crypto = require("crypto");
const APIFeatures = require("../utils/apiFeatures");

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Register Admin - Post: /api/v1/admins/registerStudent
exports.registerStudent = catchAsyncErrors(async (req, res, next) => {
  // const stPicture = req.files.stPicture.tempFilePath;

  // const result = await cloudinary.uploader.upload(stPicture.tempFilePath, {
  //   folder: "students",
  //   width: 200,
  //   crop: "scale",
  //   format: "jpg",
  // });

  req.body.admin = req.admin.id;
  const { name, className, email, password } = req.body;

  const classLevel = await ClassLevel.findOne({ name: className });
  if (!classLevel) {
    return res.status(404).json({ error: "Class level not found" });
  }

  // fs.rmSync("./tmp", { recursive: true });

  const student = await Student.create({
    name,
    className: classLevel._id,
    email,
    password,
    admin: req.admin._id,
    // stPicture: {
    //   public_id: result.public_id,
    //   url: result.secure_url,
    // },
  });
  await myEmail(
    email,
    "Admission Confirmation : ",
    `${name} 
  Thank You for Admission in Az-Zahid School & College. 
  Your Student ID is: ${student.studentId} 
  Profile:[

    Name:  ${student.name}
    Email: ${student.email}
    Password: Your Father's CNIC
    Class: ${student.classLevels}
    Student ID: ${student.studentId}
    Father Name: 
    Guardian: ${[student.guardian]}

  ] 
  
  ${[]}
  
  `
  );

  sendToken(student, 200, res);
  // error
});

// Get all students by SuperAdmin & admin - GET = /api/v1/students/allStudents
exports.getAllStudents = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.find();
  res.status(200).json({
    success: true,
    count: student.length,
    data: student,
  });
});

// Get all students by SuperAdmin & admin - GET = /api/v1/students/allStudents
exports.getAllStudentsByApiFeature = catchAsyncErrors(async (req, res, next) => {

  const resPerPage = 40;
  const studentCount = await Student.countDocuments();
  // const student = await Student.find();
  const apiFeatures = new APIFeatures(Student.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const students = await apiFeatures.query; 

  res.status(200).json({
    success: true,
    studentCount,
    students,
  });
});


// Get student details by id by admin / SuperAdmin  => api/v1/students/singleStudent/:id
exports.getStudentDetails = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(
      new ErrorHandler(`Student not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    student,
  });
});

// login student - POST = /api/v1/students/login
exports.loginStudent = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  // find student in database
  const student = await Student.findOne({ email }).select("+password");

  if (
    !student ||
    !(await student.correctPassword(password, student.password))
  ) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }

  sendToken(student, 200, res);
});

// Get login student profile => /api/v1/students/profile
exports.loginStudentProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    // The authenticated student's email is available in req.user.email
    const studentEmail = req.student.email;

    // Find the student's profile in the database using the email
    const student = await Student.findOne({ email: studentEmail });

    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }
    const studentProfile = {
      studentID: student?.studentId,
      name: student?.name,
      email: student?.email,
      class: student?.className,
      fatherName: student?.fatherName,
      status: student?.active,
      mobile: student?.mobile,
    };
    // Return the student's profile
    res.json(studentProfile);
  } catch (err) {
    // Handle any errors that occurred during the database query
    res.status(500).json({ error: "Internal server error" });
  }
});

// logout student - POST = /api/v1/students/logout
exports.logoutStudent = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logout successful",
  });
});

// *******************************************************************************************
// Forgot password - POST = /api/v1/students/forgot-password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email });

  if (!student) {
    return next(new ErrorHandler("Student not find with this email", 404));
  }

  // Get reset token
  const resetToken = student.getResetPasswordToken();
  await student.save({ validateBeforeSave: false });

  // create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/student/password/reset/${resetToken}`;
  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nif you are not requested this, please ignore this email`;

  try {
    await sendEmail({
      email: student.email,
      subject: "Your Password Reset Token",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to:${student.email}`,
    });
  } catch (err) {
    student.resetPasswordToken = undefined;
    student.resetPasswordExpire = undefined;
    await student.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// ************************************************************************
// Reset Password - POST = /api/v1/students/reset/password/:Token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const student = await Student.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!student) {
    return next(
      new ErrorHandler("Password reset token is invalid or has exipred", 400)
    ); // 400: bad request
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password do not match", 400)
    );
  }
  // Set new password
  student.password = req.body.password;
  student.resetPasswordToken = undefined;
  student.resetPasswordExpire = undefined;
  await student.save();

  sendToken(student, 200, res);
});

// Get student details by StudentID by only admin /SuperAdmin  => api/v1/students/profile/:studentId
exports.getStudentByStId = catchAsyncErrors(async (req, res, next) => {
  const studentId = req.params.studentId;
  const student = await Student.findOne({ studentId: studentId });

  if (!student) {
    return next(
      new ErrorHandler(`Student not found with StudentId: ${req.params}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    student,
  });
});

// Get student details by email by only admin /SuperAdmin  => api/v1/students/email/:studentEmail
exports.getStudentByEmail = catchAsyncErrors(async (req, res, next) => {
  const studentEmail = req.params.email;
  // const student = await Student.findOne({ email: { $regex: new RegExp ('^' + studentEmail + '$', 'i')} });
  const student = await Student.findOne({ email: studentEmail }).limit(1);

  if (!student || student.length === 0) {
    return next(
      new ErrorHandler(`Student not found with EmailID: ${req.params}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    student,
  });
});

// Get all students details by classLevels by only admin /SuperAdmin  => api/v1/students/class/:classlevels
exports.getStudentByName = catchAsyncErrors(async (req, res, next) => {
  const studentName = req.params.name;
  const student = await Student.find({ name: studentName });

  if (!student) {
    return next(
      new ErrorHandler(
        `Student not found with Student Name: ${req.params}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    student,
  });
});

// Get all students details by className by only admin /SuperAdmin  => api/v1/students/class/:classname
exports.getStudentByClassName = catchAsyncErrors(async (req, res, next) => {
  try {
    const className = req.params.className;
    const studentCount = await Student.countDocuments();

    // Find the class in the ClassLevel model
    const classData = await ClassLevel.findOne({ name: className });

    if (!classData) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Find all students belonging to the class
    const students = await Student.find({ className: classData._id });
    const totalStudents = students.length;

    return res.status(200).json({
      studentCount,
      totalStudents,
      students,
    });
  } catch (err) {
    console.error("Error fetching student records:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Update a student PUT METHOD => /api/v1/students/student/:id
exports.updateStudent = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    return next(new ErrorHandler(404, "No student found"));
  }

  res.status(200).json({
    success: true,
    student,
  });
});

// Delete a student => DELETE METHOD by admin and superAdmin => /api/v1/students/student:id
exports.deleteStudent = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findByIdAndDelete(req.params.id);

  if (!student) {
    return next(new ErrorHandler(404, "No student found"));
  }

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
  });
});
