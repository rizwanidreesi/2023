const Teacher = require("../models/Teacher");
const Admin = require("../models/admin");

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