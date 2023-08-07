const AcademicTerm = require("../models/AcademicTerm");
const Admin = require("../models/admin");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");


// Academic Terms Created By Admin only: Post Method: /api/v1/academicTerm/create
exports.createAcademicTerm = catchAsyncErrors(async (req, res, next) => {
  
  req.body.admin = req.admin.id;

  const { name, description, duration } = req.body;

  const academicTerm = await AcademicTerm.findOne({ name });
  if (academicTerm) {
    throw new Error("Academic Term already exists");
  }
  //create

  const academicTermCreated = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy: req.admin._id,
  });

  const admin = await Admin.findById(req.admin._id);
  admin.academicTerms.push(academicTermCreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Academic term created successfully",
    data: academicTermCreated,
  });
});

//@desc  get all Academic terms
//@route GET /api/v1/academic-terms
//@acess  Private
exports.getAcademicTerms = catchAsyncErrors(async (req, res, next) => {
  const academicTerms = await AcademicTerm.find();

  res.status(201).json({
    status: "success",
    message: "Academic terms fetched successfully",
    data: academicTerms,
  });
});

//@desc  get single Academic term
//@route GET /api/v1/academic-terms/:id
//@acess  Private
exports.getAcademicTerm = catchAsyncErrors(async (req, res, next) => {
  const academicTerms = await AcademicTerm.findById(req.params.id);

  if (!academicTerms) {
    return next(
      new ErrorHandler(`Academic Term not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    status: "success",
    message: "Academic terms fetched successfully",
    data: academicTerms,
  });
});

//@desc   Update  Academic term
//@route  PUT /api/v1/academic-terms/:id
//@acess  Private
exports.updateAcademicTerms = catchAsyncErrors(async (req, res, next) => {
  // const { name, description, duration } = req.body;
 
  // const createAcademicTermFound = await AcademicTerm.findOne({ name });
  // if (createAcademicTermFound) {
  //   throw new Error("Academic terms= already exists");
  // }
  const academicTerms = await AcademicTerm.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!academicTerms) {
    return next(new ErrorHandler(404, "No Academic Term found"));
  }

  res.status(201).json({
    status: "success",
    message: "Academic term updated successfully",
    data: academicTerms,
  });
});

//@desc   Delete  Academic term
//@route  PUT /api/v1/academic-terms/:id
//@acess  Private
exports.deleteAcademicTerm = catchAsyncErrors(async (req, res, next) => {
  await AcademicTerm.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic term deleted successfully",
  });
});