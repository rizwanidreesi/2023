const express = require("express");
const programRoutes = express.Router();

const {
    createProgram,
    getPrograms,
    getProgram,
    updateProgram,
    deleteProgram,
    addSubjectToProgram,
 
} = require("../controller/programCtrl");

const {
  isAuthenticatedAdmin,
  authorizeRoles,
} = require("../middlewares/adminAuth");

programRoutes.route("/create").post(isAuthenticatedAdmin, createProgram);
// programRoutes.route("/all-programs").get(isAuthenticatedAdmin, getPrograms);
// programRoutes.route("/byId/:id").get(isAuthenticatedAdmin, getProgram);
// programRoutes.route("/byId/:id").put(isAuthenticatedAdmin, updateProgram);
// programRoutes.route("/byId/:id").delete(isAuthenticatedAdmin, deleteProgram);
// programRoutes.route("/byId/:id").delete(isAuthenticatedAdmin, deleteProgram);
// programRoutes.route("/:id/subjects").put(isAuthenticatedAdmin, addSubjectToProgram);


module.exports = programRoutes;
