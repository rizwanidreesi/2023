const express = require("express");
const academicYearRoutes = express.Router();

const {createAcademicYear,getAcademicYears,getAcademicYear,updateAcademicYear,deleteAcademicYear} = require("../controller/academicYearCtrl");

const { isAuthenticatedAdmin, authorizeRoles, } = require("../middlewares/adminAuth");

academicYearRoutes.route("/create").post(isAuthenticatedAdmin, createAcademicYear);
academicYearRoutes.route("/all-academic-years").get(isAuthenticatedAdmin, getAcademicYears);
academicYearRoutes.route("/byId/:id").get(isAuthenticatedAdmin, getAcademicYear);
academicYearRoutes.route("/byId/:id").put(isAuthenticatedAdmin, updateAcademicYear);
academicYearRoutes.route("/byId/:id").delete(isAuthenticatedAdmin, deleteAcademicYear);






module.exports = academicYearRoutes