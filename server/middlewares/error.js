const ErrorHandler = require('../utils/errorHandler')


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    // err.message = err.message || 'Internal Server Error';
    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }

        error.message = err.message

        // Wrong Mongoose Object ID Errors
        if (err.name === 'CastError') {
            const message = `Resource not Found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        // Handling Mongoose Validation Errors
        if (err.name === 'ValidatorError') {
            const message = object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400)
        }

        // Handling mongoose Duplicate key Errors
        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered. Please use another value.`
            error = new ErrorHandler(message, 400)
        }

        // Handling wrong JWT token
        if (err.name === 'JsonWebTokenError') {
            const message = 'Invalid JSON Web Token. Please login again.!!!!'
            error = new ErrorHandler(message, 401)
        }

        // Handling expired JWT token
        if (err.name === 'TokenExpiredError') {
            const message = 'Expired JSON Web Token. Please login again.!!!!'
            error = new ErrorHandler(message, 401)
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })
    }

}