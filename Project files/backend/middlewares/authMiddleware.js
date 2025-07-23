const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .send({ message: "Authorization header is missing or malformed", success: false });
    }

    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
      if (err) {
        return res
          .status(401)
          .send({ message: "Token is not valid or has expired", success: false });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(500).send({ message: "Internal server error during authentication", success: false });
  }
};