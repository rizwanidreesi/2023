const express = require("express");
const teacherRouter = express.Router();

const { createTeacher } = require("../controller/teacherCtrl");
const {isAuthenticatedAdmin,authorizeRoles,} = require("../middlewares/adminAuth");
const { isAuthenticatedTeacher } = require("../middlewares/teacherauth");


teacherRouter
  .route("/createTeacher")
  .post(
    isAuthenticatedAdmin,
    authorizeRoles("superAdmin", "admin"),
    createTeacher
  );

module.exports = teacherRouter;
