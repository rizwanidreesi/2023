const Teacher = require("../models/Teacher");
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');

// Checks if the Teacher is authenticated
exports.isAuthenticatedTeacher = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler('login first to access this resource.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.Teacher = await Teacher.findById(decoded.id);
    next();
});

// Handling student roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.Teacher.role)) {
            return next(new ErrorHandler(`You are not (${req.Teacher.role}) authorized to access this resource.`, 403));
        }
        next();
    }
}
