const { response } = require("express");
const fetch = require("node-fetch");
const { User, Concert } = require("../mongodb");
const {
  getUsers,
  findUser,
  updateUserFromId,
  getUserRoles,
  deleteUserKeyrock,
  deleteUserMongo,
} = require("../admin/admin.repo");
const {
  ifNotificationHasJustSent,
} = require("../subscriptions/subscription.repo");
const { getNewRoles } = require("../admin/admin.service");

const updateUser = async (userData) => {
  try {
    const user = new User(userData);
    const queryRes = await user.save();
    return queryRes;
  } catch (err) {
    console.err(err);
  }
};

const getXAuthToken = async () => {
  const response = await fetch("http://keyrock:5001/v1/auth/tokens", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "admin@test.com",
      password: "1234",
    }),
  });
  return response.headers.get("x-subject-token");
};

const createUserAuth = async (user, xAuthToken) => {
  const response = await fetch("http://keyrock:5001/v1/users", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-token": xAuthToken,
    },
    body: JSON.stringify({ user }),
  });
  const parseRes = await response.json();
  return parseRes;
};

const getRoleId = async (role, xAuthToken) => {
  //get all roles
  let response = await fetch(
    `http://keyrock:5001/v1/applications/${process.env.APPLICATION_ID}/roles`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-token": xAuthToken,
      },
    }
  );
  const parseRes = await response.json();
  const { roles } = parseRes;
  // console.log({ roles, parseRes });
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name == role) return roles[i].id;
  }
};

const updateRoleOfUser = async (userId, action, roleId, xAuthToken) => {
  let response = await fetch(
    `http://keyrock:5001/v1/applications/${process.env.APPLICATION_ID}/users/${userId}/roles/${roleId}`,
    {
      method: action == "assign" ? "post" : "delete",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-token": xAuthToken,
      },
    }
  );
  if (response.status == 204 && action != "assign") {
    return true;
  }
  const parseRes = await response.json();
  return parseRes;
};

const getAccessToken = async (email, password) => {
  let response = await fetch("http://keyrock:5001/oauth2/token", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        process.env.APPLICATION_ID + ":" + process.env.APPLICATION_SECRET
      ).toString("base64")}`,
    },
    body: `grant_type=password&username=${email}&password=${password}`,
  });
  const parseRes = await response.json();
  return parseRes;
};

const getDataFromToken = async (accessToken) => {
  let response = await fetch(
    `http://keyrock:5001/user?access_token=${accessToken}`,
    {
      method: "get",
    }
  );
  const parseRes = await response.json();
  return parseRes;
};

//endpoints
const createUserRepo = async (userData) => {
  try {
    const xAuthToken = await getXAuthToken();
    const { name, surname, ...userDataAuth } = userData;
    let { error, user } = await createUserAuth(userDataAuth, xAuthToken);
    if (error) {
      return { error };
    }
    userId = user.id;
    const roleId = await getRoleId("user", xAuthToken);

    let response = await updateRoleOfUser(userId, "assign", roleId, xAuthToken);
    if (response.error) {
      return response;
    }
    response = await getAccessToken(userData.email, userData.password);
    const { access_token, refresh_token } = response;

    response = await getDataFromToken(access_token);

    //change data
    userData.roles = response.roles;
    userData.id = response.id;
    userData.concerts = [];
    userData.favorites = [];
    userData.notifications = [];
    userData.confirmed = false;
    delete userData.password;
    let queryRes = await updateUser(userData);
    console.log({ queryRes });
    //if 1st user he must be an admin too
    const userCount = await User.count({});
    console.log(userCount);
    if (userCount == 1) {
      const action = "assign";
      const roleName = "admin";
      const userId = queryRes._id;
      const user = await findUser(userId, roleName);
      const roleId = await getRoleId(roleName, xAuthToken);
      let response = await updateRoleOfUser(
        user.id,
        action,
        roleId,
        xAuthToken
      );
      if (response.error) {
        return response;
      }
      const newRoles = await getUserRoles(user.id, xAuthToken);
      const newArrRoles = getNewRoles(action, newRoles, user.roles, roleName);
      user.roles = newArrRoles;
      queryRes = await updateUserFromId(userId, user);
      return { user: queryRes, access_token, refresh_token };
    }
    console.log({ queryRes });
    return { user: queryRes, access_token, refresh_token };
  } catch (error) {
    console.error(error);
  }
};

const userLoginRepo = async (userData) => {
  let response = await getAccessToken(userData.email, userData.password);

  const { access_token, refresh_token } = response;
  if (!access_token) {
    return {
      error: {
        message: response,
        code: 403,
        title: "Authentication error",
      },
    };
  }
  //find data from id
  const user = await User.findOne({ email: userData.email }).exec();
  await ifNotificationHasJustSent(user.toObject());
  //store to mongodb
  return { user, access_token, refresh_token };
};

const userDataRepo = async (access_token, refresh_token) => {
  const response = await getDataFromToken(access_token);
  const { email } = response;
  if (!email) {
    //try the refresh token
    //todo
    return {
      error: {
        message: "invalid access token",
        code: 401,
        title: "Authorization error",
      },
    };
  }
  //find data from id
  const user = await User.findOne({ email }).exec();
  await ifNotificationHasJustSent(user.toObject());
  return { user, access_token, refresh_token };
};

module.exports = {
  userLoginRepo,
  createUserRepo,
  userDataRepo,
  getXAuthToken,
  getRoleId,
  updateRoleOfUser,
  getDataFromToken,
};
