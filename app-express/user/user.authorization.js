const { getUserData } = require("../auth/auth.service");
const requestedRole = "user";

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.header("access_token");
    const refreshToken = req.header("refresh_token");
    const response = await getUserData(accessToken, refreshToken);
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      let roleFound = false;
      //check if role exists
      const roles = response.user.roles;
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name == requestedRole) {
          roleFound = true;
          break;
        }
      }
      if (roleFound) {
        const user = response.user;
        req.verifiedUser = user;
        delete user._id;
        delete user.createdAt;
        delete user.updatedAt;
        delete user.__v;
        next();
      } else {
        res.status(401).json("You have to be a user to perform that action");
      }
    }
  } catch (err) {
    console.error(err.message);
    return res.status(403).json("Not Authorize");
  }
};
