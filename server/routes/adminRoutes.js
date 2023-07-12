const express = require("express");
const adminRouter = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  logoutAdmin,
  getAllAdmin,
  getAdminDetails,
  updateAdmin,
  deleteAdmin,
  editAdmin,
} = require("../controller/adminctrl");

const {
  isAuthenticatedAdmin,
  authorizeRoles,
} = require("../middlewares/adminAuth");

// adminRouter.route('/register').post(registerAdmin);
adminRouter
  .route("/register")
  .post(isAuthenticatedAdmin, authorizeRoles("superAdmin"), registerAdmin);
adminRouter.route("/login").post(loginAdmin);

adminRouter
  .route("/update/:id")
  .put(isAuthenticatedAdmin, authorizeRoles("superAdmin"), updateAdmin);


adminRouter.route("/me").get(getAdminProfile);
adminRouter
  .route("/all")
  .get(isAuthenticatedAdmin, authorizeRoles("superAdmin"), getAllAdmin);
adminRouter
  .route("/admin/:id")
  .get(isAuthenticatedAdmin, authorizeRoles("superAdmin"), getAdminDetails)
  .delete(isAuthenticatedAdmin, authorizeRoles("superAdmin"), deleteAdmin);

adminRouter.route("/logout").get(logoutAdmin);

module.exports = adminRouter;
