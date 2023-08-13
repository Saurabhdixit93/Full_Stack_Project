const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

module.exports.verifyToken = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    if (!req.headers.authorization) {
      return res.json({
        message: "Please Add Authorization Token",
        success: false,
      });
    }

    // Extract token from Authorization header and verify it
    const token = req.headers.authorization.split(" ")[1];
    const payload = await jwt.verify(token, secretKey);

    // Attach token payload (user information) to request object for further use
    req.user = payload;
   
    // Call the next middleware function in the chain
    next();
  } catch (err) {
    // Handle different types of errors that may occur during verification
    if (err.name === "TokenExpiredError") {
      return res.json({
        message: "Sorry Session Has Expired",
        success: false,
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.json({
        message: "Authorization is Required",
        success: false,
      });
    }
    return res.json({
      message: "Error In Auth VERIFICATION",
      success: false,
    });
  }
};
