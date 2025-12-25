require("dotenv").config();
const app = require("./src/app");
const ConnectToDB = require("./src/db/db");

ConnectToDB();


app.listen(3000 , ()=>{
    console.log("server is running on port 3000");
})