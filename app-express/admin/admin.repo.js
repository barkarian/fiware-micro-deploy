const fetch = require("node-fetch");
const { User, Concert } = require("../mongodb");

const getUsers = async (xAuthToken) => {
  const users = User.find({});
  return users;
};

const findUser = async (userId, roleName) => {
  const user = await User.findOne({ _id: userId }).exec();
  return user.toObject();
};

const updateUserFromId = async (userId, modification) => {
  try {
    const queryRes = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: modification },
      { new: true }
    );
    return queryRes;
  } catch (err) {
    console.error(err);
  }
};

const getUserRoles = async (userId, xAuthToken) => {
  try {
    //get all roles
    let response = await fetch(
      `http://keyrock:5001/v1/applications/${process.env.APPLICATION_ID}/users/${userId}/roles`,
      {
        method: "get",
        headers: {
          "X-Auth-token": xAuthToken,
        },
      }
    );
    const parseRes = await response.json();
    return parseRes.role_user_assignments;
  } catch (error) {
    console.error(error);
  }
};

const deleteUserKeyrock = async (userId, xAuthToken) => {
  try {
    //get all roles
    let response = await fetch(`http://keyrock:5001/v1/users/${userId}`, {
      method: "delete",
      headers: {
        "X-Auth-token": xAuthToken,
      },
    });
    if (response.status > 299) {
      const parseRes = await response.json();
      return parseRes;
    }
    return response;
  } catch (error) {
    console.error(error);
  }
};

const deleteUserMongo = async (userId) => {
  try {
    const queryRes = await User.deleteOne({ id: userId });
    return queryRes;
  } catch (error) {
    console.error(error);
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

module.exports = {
  getUsers,
  findUser,
  updateUserFromId,
  getUserRoles,
  deleteUserKeyrock,
  deleteUserMongo,
  getXAuthToken,
  updateRoleOfUser,
  getRoleId,
};
