const express = require("express");
const subjectRoutes = express.Router();

const {
  createSubject,
  getSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
  
} = require("../controller/subjectsCtrl");

const {
  isAuthenticatedAdmin,
  authorizeRoles,
} = require("../middlewares/adminAuth");


subjectRoutes.route("/:programID").post(isAuthenticatedAdmin, createSubject);
subjectRoutes.route("/all-subjects").get(isAuthenticatedAdmin, getSubjects);
subjectRoutes.route("/byId/:id").get(isAuthenticatedAdmin, getSingleSubject);
subjectRoutes.route("/byId/:id").put(isAuthenticatedAdmin, updateSubject);
subjectRoutes.route("/byId/:id").delete(isAuthenticatedAdmin, deleteSubject);

module.exports = subjectRoutes;
