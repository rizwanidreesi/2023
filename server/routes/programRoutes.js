const express = require("express");
const programRoutes = express.Router();

const {
  createProgram,
  getAllPrograms,
  getSingleProgram,
  updateProgram,
  deleteProgram,
  addSubjectToProgram,
} = require("../controller/programCtrl");

const {
  isAuthenticatedAdmin,
  authorizeRoles,
} = require("../middlewares/adminAuth");

programRoutes.route("/create").post(isAuthenticatedAdmin, createProgram);
programRoutes.route("/all-programs").get(isAuthenticatedAdmin, getAllPrograms);
programRoutes.route("/byId/:id").get(isAuthenticatedAdmin, getSingleProgram);
programRoutes.route("/byId/:id").put(isAuthenticatedAdmin, updateProgram);
programRoutes.route("/byId/:id").delete(isAuthenticatedAdmin, deleteProgram);

programRoutes.route("/:id/subjects").put(isAuthenticatedAdmin, addSubjectToProgram);

module.exports = programRoutes;
