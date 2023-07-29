const express = require("express");
const academicTermRoutes = express.Router();

const {
  createAcademicTerm,
  getAcademicTerms,
  getAcademicTerm,
  updateAcademicTerms,
  deleteAcademicTerm,
} = require("../controller/academicTermCtrl");

const {
  isAuthenticatedAdmin,
  authorizeRoles,
} = require("../middlewares/adminAuth");

academicTermRoutes.route("/create").post(isAuthenticatedAdmin, createAcademicTerm);
academicTermRoutes.route("/all-academic-term").get(isAuthenticatedAdmin, getAcademicTerms);
academicTermRoutes.route("/byId/:id").get(isAuthenticatedAdmin, getAcademicTerm);
academicTermRoutes.route("/byId/:id").put(isAuthenticatedAdmin, updateAcademicTerms);
academicTermRoutes.route("/byId/:id").delete(isAuthenticatedAdmin, deleteAcademicTerm);

module.exports = academicTermRoutes;
