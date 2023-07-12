const express = require("express");
const studentRouter = express.Router();

const {
    registerStudent,
    getAllStudents,
  } = require("../controller/studentCtrl");

  const {
    isAuthenticatedAdmin,
    authorizeRoles,
  } = require("../middlewares/adminAuth");
  const {
    isAuthenticatedStudent,
  } = require("../middlewares/studentauth");

  studentRouter
  .route("/registerStudent")
  .post(isAuthenticatedAdmin, authorizeRoles("superAdmin","admin"), registerStudent);

  studentRouter
  .route("/allStudents")
  .get(isAuthenticatedAdmin, authorizeRoles("superAdmin","admin"), getAllStudents);


  module.exports = studentRouter;

