// Create and send token and save in cookies
const sendToken = (admin, statusCode, res) => {

    // create jwt token
    const token = admin.getJwtToken();

    // set cookie
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, cookieOptions).json({
        success: true,
        token,
        admin
    });
}

module.exports = sendToken;
