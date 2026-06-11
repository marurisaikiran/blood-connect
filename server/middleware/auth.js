const passport = require("passport");

// Verifies JWT and attaches req.user
const protect = passport.authenticate("jwt", { session: false });

// Restricts route to specific roles, e.g. authorize("donor", "admin")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized for this action`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
