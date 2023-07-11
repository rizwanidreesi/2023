const express = require('express');
const adminRouter = express.Router();

const {
    registerAdmin
} = require('../controller/adminctrl');

adminRouter.route('/register').post(registerAdmin);

module.exports = adminRouter;