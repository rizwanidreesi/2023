const express = require("express");
const classLevelRouter = express.Router();

const {createClassLevel, getAllClassLevel, getSingleClassLevel, updateClassLevel, deleteClassLevel} = require("../controller/classLevelCtrl");

const { isAuthenticatedAdmin, authorizeRoles, } = require("../middlewares/adminAuth");

classLevelRouter.route("/create").post(isAuthenticatedAdmin, createClassLevel);
classLevelRouter.route("/allclasses").get(isAuthenticatedAdmin, getAllClassLevel);
classLevelRouter.route("/class/:id").get(isAuthenticatedAdmin, getSingleClassLevel);
classLevelRouter.route("/class/:id").put(isAuthenticatedAdmin, updateClassLevel);
classLevelRouter.route("/class/:id").delete(isAuthenticatedAdmin, deleteClassLevel);






module.exports = classLevelRouter