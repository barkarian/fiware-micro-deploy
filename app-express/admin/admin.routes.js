const router = require("express").Router();
const authorization = require("./admin.authorization");
const {
  getAllUsers,
  modifyRolesOfUser,
  deleteUser,
} = require("./admin.service");

router.get("/all-users", authorization, async (req, res) => {
  try {
    const user = req.verifiedUser;
    const response = await getAllUsers();
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.post("/add-role", authorization, async (req, res) => {
  try {
    const accessToken = req.header("access_token");
    const user = req.verifiedUser;
    const { userId, roleName } = req.body;
    const response = await modifyRolesOfUser(
      userId,
      "assign",
      roleName,
      accessToken
    );
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.post("/remove-role", authorization, async (req, res) => {
  try {
    const accessToken = req.header("access_token");
    const user = req.verifiedUser;
    const { userId, roleName } = req.body;
    const response = await modifyRolesOfUser(
      userId,
      "remove",
      roleName,
      accessToken
    );
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.delete("/user/:id", authorization, async (req, res) => {
  try {
    const accessToken = req.header("access_token");
    const user = req.verifiedUser;
    const userId = req.params.id;
    response = await deleteUser(userId);
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

module.exports = router;
