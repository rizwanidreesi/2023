const express = require("express");
const teacherRouter = express.Router();

const {
  createTeacher,
  getAllTeachers,
  getAllTeachersByApiFeature,
  getTeacherDetails,
  getTeacherByTeId,
  updateTeacher,
  deleteTeacher,
  loginTeacher,
  loginTeacherProfile,
  logoutTeacher,
  adminUpdateTeacher,
} = require("../controller/teacherCtrl");

const {
  isAuthenticatedAdmin,
  authorizeRoles,
} = require("../middlewares/adminAuth");

const { isAuthenticatedTeacher, authorizeEmp } = require("../middlewares/teacherauth");

teacherRouter
  .route("/createTeacher")
  .post(
    isAuthenticatedAdmin,
    authorizeRoles("superAdmin", "admin"),
    createTeacher
  );
teacherRouter
  .route("/allTeachers")
  .get(
    isAuthenticatedAdmin,
    authorizeRoles("superAdmin", "admin"),
    getAllTeachers
  );
teacherRouter
  .route("/allTeachersByApiFeatures")
  .get(
    isAuthenticatedAdmin,
    authorizeRoles("superAdmin", "admin"),
    getAllTeachersByApiFeature
  );
teacherRouter
  .route("/byId/:id")
  .get(
    isAuthenticatedAdmin,
    authorizeRoles("superAdmin", "admin"),
    getTeacherDetails
  );
teacherRouter
  .route("/profile/:teacherId")
  .get(
    isAuthenticatedAdmin,
    authorizeRoles("superAdmin", "admin"),
    getTeacherByTeId
  );

// update
teacherRouter
  .route("/byId/:id")
  .put(
    isAuthenticatedAdmin,
    authorizeRoles("superAdmin", "admin"),
    updateTeacher
  );

// delete
teacherRouter
  .route("/byId/:id")
  .delete(
    isAuthenticatedAdmin,
    authorizeRoles("superAdmin", "admin"),
    deleteTeacher
  );

// login Teachers
teacherRouter.route("/login").post(loginTeacher);

// Login Teacher Can See his / her profile
teacherRouter.route("/profile").get(isAuthenticatedTeacher, loginTeacherProfile);


// logout
teacherRouter.route("/logout").get(logoutTeacher);


module.exports = teacherRouter;
