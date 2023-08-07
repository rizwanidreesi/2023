const Subject = require("../models/Subject");
const Admin = require("../models/admin");
const Program = require("../models/Program");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");


// Subject Created By Admin only: Post Method: /api/v1/subject/create
exports.createSubject = catchAsyncErrors(async (req, res, next) => {
  
  req.body.admin = req.admin.id;

  const { name, description,academicTerm } = req.body;

  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy: req.admin._id,
  });

//   const admin = await Admin.findById(req.admin._id);
//   admin.academicTerms.push(academicTermCreated._id);
  res.status(201).json({
    status: "success",
    message: "Academic term created successfully",
    data: subjectCreated,
  });
});

//@desc  get all Academic terms
//@route GET /api/v1/academic-terms
//@acess  Private
exports.getSubjects = catchAsyncErrors(async (req, res, next) => {
  const classes = await Subject.find();

  res.status(201).json({
    status: "success",
    message: "All Subjects fetched successfully",
    data: classes,
  });
});

//@desc  get single Academic term
//@route GET /api/v1/academic-terms/:id
//@acess  Private
exports.getSubject = catchAsyncErrors(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return next(
      new ErrorHandler(`Subject not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    status: "success",
    message: "Subject fetched successfully",
    data: subject,
  });
});

//@desc   Update  Academic term
//@route  PUT /api/v1/academic-terms/:id
//@acess  Private
exports.updateSubject = catchAsyncErrors(async (req, res, next) => {
  // const { name, description, duration } = req.body;
 
  // const createAcademicTermFound = await AcademicTerm.findOne({ name });
  // if (createAcademicTermFound) {
  //   throw new Error("Academic terms= already exists");
  // }
  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!subject) {
    return next(new ErrorHandler(404, "No Subject found"));
  }

  res.status(201).json({
    status: "success",
    message: "Subject updated successfully",
    data: subject,
  });
});

//@desc   Delete  Academic term
//@route  PUT /api/v1/academic-terms/:id
//@acess  Private
exports.deleteSubject = catchAsyncErrors(async (req, res, next) => {
  await Subject.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Subject deleted successfully",
  });
});