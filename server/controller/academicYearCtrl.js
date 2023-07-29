const AcademicYear = require("../models/AcademicYear");
const Admin = require("../models/admin");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");


//@desc Create Academic Year
//@route POST /api/v1/academic-years
//@acess  Private
exports.createAcademicYear = catchAsyncErrors(async (req, res, next) => {
  req.body.admin = req.admin.id;

  const { name, fromYear, toYear } = req.body;
  //check if exists
  const academicYear = await AcademicYear.findOne({ name });
  if (academicYear) {
    throw new Error("Academic year already exists");
  }
  //create
  const academicYearCreated = await AcademicYear.create({
    name,
    fromYear,
    toYear,
    createdBy: req.admin._id,
  });
  //push academic into admin
  const admin = await Admin.findById(req.admin._id);
  admin.academicYears.push(academicYearCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Academic year created successfully",
    data: academicYearCreated,
  });
});

//@desc  get all Academic Years
//@route GET /api/v1/academic-years
//@acess  Private
exports.getAcademicYears = catchAsyncErrors(async (req, res, next) => {
  const academicYears = await AcademicYear.find();

  res.status(201).json({
    status: "success",
    message: "Academic years fetched successfully",
    data: academicYears,
  });
});

//@desc  get single Academic Year
//@route GET /api/v1/academic-years/:id
//@acess  Private
exports.getAcademicYear = catchAsyncErrors(async (req, res, next) => {
  const academicYears = await AcademicYear.findById(req.params.id);

  if (!academicYears) {
    return next(
      new ErrorHandler(`Student not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    status: "success",
    message: "Academic years fetched successfully",
    data: academicYears,
  });
});

//@desc   Update  Academic Year
//@route  PUT /api/v1/academic-years/:id
//@acess  Private
exports.updateAcademicYear = catchAsyncErrors(async (req, res, next) => {
  
  const academicYear = await AcademicYear.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!academicYear) {
    return next(new ErrorHandler(404, "No Academic Year found"));
  }

  res.status(200).json({
    success: true,
    academicYear,
  });

  // const { name, fromYear, toYear } = req.body;

  // const createAcademicYearFound = await AcademicYear.findOne({ name });
  // if (createAcademicYearFound) {
  //   throw new Error("Academic year already exists");
  // }
  // const academicYear = await AcademicYear.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     name,
  //     fromYear,
  //     toYear,
  //     createdBy: req.admin._id,
  //   },
  //   {
  //     new: true,
  //   }
  // );
  // if (!academicYear) {
  //   return next(new ErrorHandler(404, "No Academic Year found"));
  // }

  // res.status(201).json({
  //   status: "success",
  //   message: "Academic years updated successfully",
  //   data: academicYear,
  // });
});

//@desc   Update  Academic Year
//@route  PUT /api/v1/academic-years/:id
//@acess  Private
exports.deleteAcademicYear = catchAsyncErrors(async (req, res, next) => {
  await AcademicYear.findByIdAndDelete(req.params.id);

  if (!AcademicYear) {
    return next(new ErrorHandler(404, "No Academic Year found"));
  }

  res.status(201).json({
    status: "success",
    message: "Academic year deleted successfully",
  });
});
