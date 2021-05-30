const jwt = require("jsonwebtoken");

exports.isAuthorised = (req, res, next) => {
  const token = req.headers["auth-token"];

  if (!token) {
    return res.status(401).json({
      error: "No token found",
    });
  }

  jwt.verify(token, process.env.PRIVATE_KEY, (err, decodedUser) => {
    if (decodedUser && !err) {
      req.user = decodedUser;
      next();
    } else {
      return res.status(401).json({
        error: "Invalid token, You are unauthorised",
      });
    }
  });
};
