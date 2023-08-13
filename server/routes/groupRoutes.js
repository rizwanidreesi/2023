const express = require("express");
const groupRoutes = express.Router();

const {
  createGroup,
  getAllGroups,
  getSingleGroup,
  updateGroup,
  deleteGroup,
} = require("../controller/groupCtrl");

const {
  isAuthenticatedAdmin,
  authorizeRoles,
} = require("../middlewares/adminAuth");

groupRoutes.route("/create").post(isAuthenticatedAdmin, createGroup);
groupRoutes.route("/all-groups").get(isAuthenticatedAdmin, getAllGroups);
groupRoutes.route("/byId/:id").get(isAuthenticatedAdmin, getSingleGroup);
groupRoutes.route("/byId/:id").put(isAuthenticatedAdmin, updateGroup);
groupRoutes.route("/byId/:id").delete(isAuthenticatedAdmin, deleteGroup);

module.exports = groupRoutes;
