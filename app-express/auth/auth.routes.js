const router = require("express").Router();
const { createNewUser, loginUser, getUserData } = require("./auth.service");

router.post("/create-user", async (req, res) => {
  try {
    const createUserData = req.body;
    console.log(createUserData);
    const response = await createNewUser(createUserData);
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const userLoginData = req.body;
    console.log(userLoginData);
    const response = await loginUser(userLoginData);
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.post("/user-data", async (req, res) => {
  try {
    const { access_token, refresh_token } = req.body;
    const response = await getUserData(access_token, refresh_token);
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
