const { userLoginRepo, createUserRepo, userDataRepo } = require("./auth.repo");

const createNewUser = async (user) => {
  const response = await createUserRepo(user);
  return response;
};

const loginUser = async (user) => {
  const response = await userLoginRepo(user);
  return response;
};

const getUserData = async (access_token, refresh_token) => {
  const response = await userDataRepo(access_token, refresh_token);
  return response;
};

module.exports = { createNewUser, loginUser, getUserData };
