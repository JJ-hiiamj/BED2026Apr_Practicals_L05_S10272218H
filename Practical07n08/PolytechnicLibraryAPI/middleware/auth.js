const jwt = require("jsonwebtoken");
require("dotenv").config();

// Verifies the JWT is present and valid. Attaches decoded user info to req.user.
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // expects "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: no token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: invalid or expired token" });
    }

    req.user = decoded; // { id, role, iat, exp }
    next();
  });
}

// Returns a middleware that only allows the given roles through.
// Usage: authorizeRoles("librarian") or authorizeRoles("librarian", "member")
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

module.exports = {
  verifyJWT,
  authorizeRoles,
};
