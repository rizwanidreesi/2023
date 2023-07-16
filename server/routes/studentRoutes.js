const express = require("express");
const studentRouter = express.Router();

const {
    registerStudent,
    getAllStudents,
    getStudentDetails,
    getStudentByStId,
    loginStudent,
    logoutStudent,
    getStudentByEmail,
    getStudentByClass
  } = require("../controller/studentCtrl");

  const {
    isAuthenticatedAdmin,
    authorizeRoles,
  } = require("../middlewares/adminAuth");
  const {
    isAuthenticatedStudent,
  } = require("../middlewares/studentauth");

  // routes

  studentRouter
  .route("/registerStudent")
  .post(isAuthenticatedAdmin, authorizeRoles("superAdmin","admin"), registerStudent);

  studentRouter.route("/login")
  .post(loginStudent)

  studentRouter
  .route("/allStudents")
  .get(isAuthenticatedAdmin, authorizeRoles("superAdmin","admin"), getAllStudents);
  studentRouter
  .route("/singleStudent/:id")
  .get(isAuthenticatedAdmin, getStudentDetails);
studentRouter
  .route("/profile/:studentId")
  .get(isAuthenticatedAdmin, authorizeRoles("superAdmin","admin"), getStudentByStId);
  
  studentRouter
  .route("/email/:studentEmail")
  .get(isAuthenticatedAdmin, authorizeRoles("superAdmin","admin"), getStudentByEmail);
  studentRouter
  .route("/class/:classLevels")
  .get(isAuthenticatedAdmin, authorizeRoles("superAdmin","admin"), getStudentByClass);
  

  studentRouter.route("/logout").get(logoutStudent);

  module.exports = studentRouter;

