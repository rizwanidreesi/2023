const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/smis2023');
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection failed", error.message);
  }
};

dbConnect();

// process.env.MONGO_URL