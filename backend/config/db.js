const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
      });
  
      console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
      console.log(`Error: ${error.message}`.red.bold);
      process.exit(1); // Exit with a non-zero status code to indicate an error
    }
  };
  
  module.exports = connectDB;


  //mongoose.connect to connect with the db by accessing the value in env file
  //process.env.MONGO_URI is the value of the MONGO_URI key in the .env
