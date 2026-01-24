// middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config(); 

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    // console.log("\n🕵️‍♂️ [Middleware Start] Checking Token...");

    if (!authHeader) {
      throw new Error("Header hi gayab hai!");
    }
    const token = authHeader.replace("Bearer ", "");
    // 1. Secret Key Check
    // console.log("🔑 Checking Secret Key:", process.env.JWT_SECRET_KEY ? "Exists ✅" : "Missing ❌");

    // 2. Token Verify Check
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // console.log("✅ Signature Match! User ID:", decoded.id);
    } catch (err) {
      // console.log("❌ Signature FAIL:", err.message);
      throw new Error("Invalid Signature (Secret Key Mismatch)");
    }

    // 3. Database User Check
    const user = await User.findById(decoded.id);
    if (!user) {
      // console.log("❌ Database mein User nahi mila! ID:", decoded.id);
      throw new Error("User Not Found in DB");
    }
    // console.log("✅ User Found:", user.email, "| Role:", user.role);
    req.user = user;
    next();

  } catch (error) {
    // console.error("⛔ [BLOCK] Auth Failed:", error.message);
    res.status(401).json({ error: error.message });
  }
};

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        // console.log("👮‍♂️ Admin Access Granted!");
        next();
    } else {
        // console.log("🚫 Access Denied! User is not Admin.");
        res.status(403).json({ message: "Admin only!" });
    }
};

module.exports = { authMiddleware, adminMiddleware };