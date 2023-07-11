const app = require('./app');
require ('./config/dbConnect');
const dotenv = require ('dotenv');

const cloudinary = require('cloudinary');


// Handle uncaught exceptions
process.on('uncaught exception', err => {
    console.log(`Error: ${err.stack}`);
    console.log('Shutting Down due to Uncaught Exceptions');
    process.exit(1);
})


// connect database
// connectDatabase();

// Setting up config file
dotenv.config({ path: 'server/config/config.env' });

// Setting up Cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down server due to unhandled promise rejection.`);
    server.close(() => {
        process.exit(1);
    });
});