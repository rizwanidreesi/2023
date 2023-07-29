const ClassLevel = require("../models/ClassLevel");
const Admin = require("../models/admin");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//  class level created by Admin: Post => api/vi/classlevel/create

exports.createClassLevel = catchAsyncErrors(async (req, res, next) => {
  req.body.admin = req.admin.id;

  const { name, description } = req.body;

  const classCreated = await ClassLevel.create({
    name,
    description,
    createdBy: req.admin._id,
  });

  const admin = await Admin.findById(req.admin._id);
  admin.classLevels.push(classCreated._id);

  //save
  await admin.save();

  res.status(200).json({
    status: "success",
    message: "Class created successfully",
    data: classCreated,
  });
});

// Get all classLevels by SuperAdmin & admin - GET = /api/v1/classlevel/allclasses
exports.getAllClassLevel = catchAsyncErrors(async (req, res, next) => {
  const classlevels = await ClassLevel.find();
  res.status(200).json({
    success: true,
    count: classlevels.length,
    data: classlevels,
  });
});

// Get classLevel details by id by admin / SuperAdmin  => api/v1/classlevel/singleClass/:id

exports.getSingleClassLevel = catchAsyncErrors(async (req, res, next) => {
  const classlevel = await ClassLevel.findById(req.params.id);

  if (!classlevel) {
    return next(
      new ErrorHandler(`ClassLevel not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    classlevel,
  });
});

// Update a classLevel PUT METHOD => /api/v1/classlevel/class/:id
exports.updateClassLevel = catchAsyncErrors(async (req, res, next) => {
  const { name, description } = req.body;
  //check name exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    throw new Error("Class already exists");
  }
  const classlevel = await ClassLevel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!classlevel) {
    return next(new ErrorHandler(404, "No ClassLevel found"));
  }

  res.status(200).json({
    success: true,
    classlevel,
  });
});

// Delete a student => DELETE METHOD by admin and superAdmin => /api/v1/classlevel/class:id
exports.deleteClassLevel = catchAsyncErrors(async (req, res, next) => {
  const classlevel = await ClassLevel.findByIdAndDelete(req.params.id);

  if (!classlevel) {
    return next(new ErrorHandler(404, "No ClassLevel found"));
  }

  res.status(200).json({
    success: true,
    message: "ClassLevel deleted successfully",
  });
});
