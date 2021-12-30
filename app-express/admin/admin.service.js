const {
  getUsers,
  findUser,
  updateUserFromId,
  getUserRoles,
  deleteUserKeyrock,
  deleteUserMongo,
  getXAuthToken,
  updateRoleOfUser,
  getRoleId,
} = require("./admin.repo");
const {
  //getRoleId,
  //updateRoleOfUser,
  // getXAuthToken,
} = require("../auth/auth.repo");
//const { updateUser } = require("../eventOrganizer/eventOrganizer.repo");

const getAllUsers = async () => {
  try {
    console.log({
      getRoleId,
      updateRoleOfUser,
      getXAuthToken,
      getUsers,
      findUser,
      updateUserFromId,
      getUserRoles,
      deleteUserKeyrock,
      deleteUserMongo,
    });
    const xAuthToken = await getXAuthToken();
    const users = await getUsers(xAuthToken);

    return users;
  } catch (error) {
    console.error(error);
  }
};

const modifyRolesOfUser = async (userId, action, roleName, accessToken) => {
  try {
    const xAuthToken = await getXAuthToken();
    const user = await findUser(userId, roleName);
    const roleId = await getRoleId(roleName, xAuthToken);
    let response = await updateRoleOfUser(user.id, action, roleId, xAuthToken);
    if (response.error) {
      return response;
    }
    const newRoles = await getUserRoles(user.id, xAuthToken);
    const newArrRoles = getNewRoles(action, newRoles, user.roles, roleName);
    user.roles = newArrRoles;
    const queryRes = await updateUserFromId(userId, user);
    return queryRes;
  } catch (error) {
    console.error(error);
  }
};

const deleteUser = async (userId) => {
  try {
    const xAuthToken = await getXAuthToken();
    let response = await deleteUserKeyrock(userId, xAuthToken);
    if (response.error) {
      return response;
    }
    response = await deleteUserMongo(userId);
    if (response.deletedCount == 0) {
      return {
        error: {
          message: "something went wrong while deleting mongo document",
          code: 500,
          title: "Server error",
        },
      };
    }
    return `User:${userId} has been deleted`;
  } catch (error) {
    console.error(error);
  }
};

function getNewRoles(action, newRoles, oldRoles, roleName) {
  if (action == "assign") {
    let newElement;
    for (const newRole of newRoles) {
      let found = false;
      for (const oldRole of oldRoles) {
        if (newRole.role_id == oldRole.id) {
          found = true;
        }
      }
      if (!found) {
        newElement = {};
        newElement.name = roleName;
        newElement.id = newRole.role_id;
        break;
      }
    }
    if (newElement) {
      oldRoles.push(newElement);
    }
    return oldRoles;
  } else {
    for (let i = 0; i < oldRoles.length; i++) {
      let found = false;
      for (const newRole of newRoles) {
        console.log({ newRole });
        if (newRole.role_id == oldRoles[i].id) {
          found = true;
        }
      }
      if (!found) {
        console.log({ msg: "removed index is gonna be:", i });
        console.log(oldRoles);
        oldRoles.splice(i, 1);
        //remove i from oldRoles
        break;
      }
    }
  }
  return oldRoles;
}

module.exports = { getAllUsers, modifyRolesOfUser, deleteUser, getNewRoles };
