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
    req.teacher = await Teacher.findById(decoded.id);
    next();
});

// Handling teacher roles
exports.authorizeEmp = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.teacher.role)) {
            return next(new ErrorHandler(`You are not (${req.teacher.role}) authorized to access this resource.`, 403));
        }
        next();
    }
}
