const mongoose = require("mongoose");

const ConnectToDB = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to DB");
  } catch (error) {
    console.log("failed to connected to dataBase", error);
  }
};
module.exports = ConnectToDB;
