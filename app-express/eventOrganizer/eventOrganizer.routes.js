const router = require("express").Router();
const authorization = require("./eventOrganizer.authorization");
const {
  createAnEvent,
  deleteAnEvent,
  updateAnEvent,
} = require("./eventOrganizer.services");

router.post("/create", authorization, async (req, res) => {
  try {
    const user = req.verifiedUser;
    const event = req.body;

    const response = await createAnEvent(user, event);
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.delete("/:id", authorization, async (req, res) => {
  try {
    const eventId = req.params.id;
    const user = req.verifiedUser;

    const response = await deleteAnEvent(user, eventId);
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.put("/:id", authorization, async (req, res) => {
  try {
    const eventId = req.params.id;
    const user = req.verifiedUser;
    const event = req.body;

    const response = await updateAnEvent(user, eventId, event);
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
