const permissions = require("../constants/permissions");

const authorize = (requiredPermission) => {
  return (request, response, next) => {
    // Auth middleware will run before this middleware
    const user = request.user;

    if (!user) {
      return response.status(401).json({
        message: "Unauthorized access",
      });
    }

    const userPermissions = permissions[user.role] || [];

    if (!userPermissions.includes(requiredPermission)) {
      return response.status(403).json({
        message: "Forbidden: Insufficient Permission",
      });
    }

    next();
  };
};

module.exports = authorize;
