const Group = require("../models/YearGroup");
const Admin = require("../models/admin");


const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//@desc  Create year group
//@route POST /api/v1/year-groups
//@acess  Private

exports.createGroup = catchAsyncErrors(async (req, res, next) => {
    const { name, academicYear } = req.body;
  
    //check if exists
    const group = await Group.findOne({ name });
    if (group) {
      throw new Error("Year Group/Graduation   already exists");
    }
    //create
    const yearGroup = await Group.create({
      name,
      academicYear,
      createdBy: req.admin._id,
    });
    //push to the program
    //find the admin
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      throw new Error("Admin not found");
    }
    //push year group into admin
    admin.yearGroups.push(yearGroup._id);
    //save
    await admin.save();
    res.status(201).json({
      status: "success",
      message: "Year Group created successfully",
      data: yearGroup,
    });
  });
  

  //@desc  get all Year grups
//@route GET /api/v1/year-groups
//@acess  Private

exports.getAllGroups = catchAsyncErrors(async (req, res, next) => {
  const groups = await Group.find();
  res.status(201).json({
    status: "success",
    message: "Year Groups fetched successfully",
    data: groups,
  });
});

//@desc  get single year group
//@route GET /api/v1/year-group/:id
//@acess  Private

exports.getSingleGroup = catchAsyncErrors(async (req, res, next) => {
  const group = await Group.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Year Group fetched successfully",
    data: group,
  });
});

//@desc   Update  Year Group
//@route  PUT /api/v1/year-groups/:id
//@acess  Private

exports.updateGroup = catchAsyncErrors(async (req, res, next) => {
  const { name, academicYear } = req.body;
  //check name exists
  const yearGroupFound = await Group.findOne({ name });
  if (yearGroupFound) {
    throw new Error("year Group already exists");
  }
  const yearGroup = await Group.findByIdAndUpdate(
    req.params.id,
    {
      name,
      academicYear,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Year Group  updated successfully",
    data: yearGroup,
  });
});

//@desc   Delete  Year group
//@route  PUT /api/v1/year-groups/:id
//@acess  Private
exports.deleteGroup = catchAsyncErrors(async (req, res, next) => {
  await Group.findByIdAndDelete(req.params.id);

  if (!Group) {
    return next(new ErrorHandler(404, "No Year Group found"));
  }
  res.status(201).json({
    status: "success",
    message: "Year Group deleted successfully",
  });
});
