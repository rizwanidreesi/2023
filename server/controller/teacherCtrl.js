const Teacher = require("../models/Teacher");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const myEmail = require("../utils/myEmail");
const crypto = require("crypto");
const APIFeatures = require("../utils/apiFeatures");

// Register Admin - Post: /api/v1/admins/registerStudent
exports.createTeacher = catchAsyncErrors(async (req, res, next) => {
  req.body.admin = req.admin.id;
  const { name, email, password, cnic } = req.body;

  // const teacher = await ClassLevel.findOne({ name: className });
  // if (!classLevel) {
  //   return res.status(404).json({ error: "Class level not found" });
  // }

  // fs.rmSync("./tmp", { recursive: true });

  const teacher = await Teacher.create({
    name,
    email,
    password,
    cnic,
    createdBy: req.admin._id,
    // stPicture: {
    //   public_id: result.public_id,
    //   url: result.secure_url,
    // },
  });

  await myEmail(
    email,
    "Job Confirmation : ",
    `${name} 
    you are hired as Teacher in Az-Zahid School & College. 
    Your Teacher ID is: ${teacher.studentId} 
    Profile:[
  
      Name:  ${teacher.name}
      Email: ${teacher.email}
      Password: Your CNIC
      CNIC: ${teacher.cnic}
      Teacher ID: ${teacher.teacherId}
      Father Name:${teacher.fatherName} 
      
  
    ] 
    
    ! This is System generated Email so please don't reply
    
    `
  );

  sendToken(teacher, 200, res);
  // error
});

// Get all Teachers by SuperAdmin & admin - GET = /api/v1/teacher/allTeachers
exports.getAllTeachers = catchAsyncErrors(async (req, res, next) => {
  const teacher = await Teacher.find();
  res.status(200).json({
    success: true,
    count: teacher.length,
    data: teacher,
  });
});

// Get all Teachers by SuperAdmin & admin by API FEATHERS - GET = /api/v1/teachers/byApiFeatures
exports.getAllTeachersByApiFeature = catchAsyncErrors(
  async (req, res, next) => {
    const resPerPage = 40;
    const teacherCount = await Teacher.countDocuments();
    // const student = await Student.find();
    const apiFeatures = new APIFeatures(Teacher.find(), req.query)
      .search()
      .filter()
      .pagination(resPerPage);
    const teachers = await apiFeatures.query;

    res.status(200).json({
      success: true,
      teacherCount,
      teachers,
    });
  }
);

// Get Teacher details by id by admin / SuperAdmin  => api/v1/teachers/byId/:id
exports.getTeacherDetails = catchAsyncErrors(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    return next(
      new ErrorHandler(`Teacher not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    teacher,
  });
});

// Get TEacher details by TeacherId by only admin /SuperAdmin  => api/v1/students/profile/:teacherId
exports.getTeacherByTeId = catchAsyncErrors(async (req, res, next) => {
  const teacherId = req.params.teacherId;
  const teacher = await Teacher.findOne({ teacherId: teacherId });

  if (!teacher) {
    return next(
      new ErrorHandler(`Teacher not found with TeacherId: ${req.params}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    teacher,
  });
});

// Update a Teacher PUT METHOD => /api/v1/teachers/byId/:id
exports.updateTeacher = catchAsyncErrors(async (req, res, next) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!teacher) {
    return next(new ErrorHandler(404, "No Techer found"));
  }

  res.status(200).json({
    success: true,
    teacher,
  });
});

// Delete a Teacher => DELETE METHOD by admin and superAdmin => /api/v1/teacher/byId/:id
exports.deleteTeacher = catchAsyncErrors(async (req, res, next) => {
  const teacher = await Teacher.findByIdAndDelete(req.params.id);

  if (!teacher) {
    return next(new ErrorHandler(404, "No Teacher found"));
  }

  res.status(200).json({
    success: true,
    message: "Teacher deleted successfully",
  });
});

// login teacher - POST = /api/v1/teachers/login
exports.loginTeacher = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  // find teacher in database
  const teacher = await Teacher.findOne({ email }).select("+password");

  if (
    !teacher ||
    !(await teacher.correctPassword(password, teacher.password))
  ) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }

  sendToken(teacher, 200, res);
});

// Get login Teacher profile => /api/v1/teachers/profile
exports.loginTeacherProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    // The authenticated student's email is available in req.user.email
    const teacherEmail = req.teacher.email;

    // Find the teacher's profile in the database using the email
    const teacher = await Teacher.findOne({ email: teacherEmail });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher profile not found" });
    }
    const teacherProfile = {
      teacherId: teacher?.teacherId,
      name: teacher?.name,
      email: teacher?.email,
      Designation: teacher?.designation,
      Salary: teacher?.monthlySalary,

    };
    // Return the student's profile
    res.json(teacherProfile);
  } catch (err) {
    // Handle any errors that occurred during the database query
    res.status(500).json({ error: "Internal server error" });
  }
});

// logout teacher - get = /api/v1/teachers/logout
exports.logoutTeacher = catchAsyncErrors(async (req, res, next) => {
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
  const teacher = await Teacher.findOne({ email: req.body.email });

  if (!teacher) {
    return next(new ErrorHandler("Teacher not find with this email", 404));
  }

  // Get reset token
  const resetToken = teacher.getResetPasswordToken();
  await teacher.save({ validateBeforeSave: false });

  // create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/teachers/password/reset/${resetToken}`;
  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nif you are not requested this, please ignore this email`;

  try {
    await sendEmail({
      email: teacher.email,
      subject: "Your Password Reset Token",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to:${teacher.email}`,
    });
  } catch (err) {
    teacher.resetPasswordToken = undefined;
    teacher.resetPasswordExpire = undefined;
    await teacher.save({ validateBeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
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

  const teacher = await Teacher.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!teacher) {
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
  teacher.password = req.body.password;
  teacher.resetPasswordToken = undefined;
  student.resetPasswordExpire = undefined;
  await teacher.save();

  sendToken(teacher, 200, res);
});


//@desc     Admin updating Teacher profile
//@route    UPDATE /api/v1/teachers/:teacherID/admin
//@access   Private Admin only
exports.adminUpdateTeacher = catchAsyncErrors(async (req, res, next) => {
  const { program, classLevel, academicYear, subject } = req.body;
  //if email is taken
  const teacherFound = await Teacher.findById(req.params.teacherID);
  if (!teacherFound) {
    throw new Error("Teacher not found");
  }
  //Check if teacher is withdrawn
  if (teacherFound.isWitdrawn) {
    throw new Error("Action denied, teacher is withdraw");
  }
  //assign a program
  if (program) {
    teacherFound.program = program;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign Class level
  if (classLevel) {
    teacherFound.classLevel = classLevel;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign Academic year
  if (academicYear) {
    teacherFound.academicYear = academicYear;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign subject
  if (subject) {
    teacherFound.subject = subject;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }
});