const router = require("express").Router();
const authorization = require("./user.authorization");
const {
  searchConcerts,
  addToFavorites,
  removeFromFavorites,
  addToSubscriptions,
  removeFromSubscriptions,
  findEventsByIds,
} = require("./user.services");

router.post("/concerts-by-ids", authorization, async (req, res) => {
  try {
    const user = req.verifiedUser;
    const concertIds = req.body;
    const response = await findEventsByIds(concertIds);
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.get("/concerts", authorization, async (req, res) => {
  try {
    const artistName = req.query.artistName;
    const organizer = req.query.organizer;
    const date = req.query.date;
    const category = req.query.category;
    const title = req.query.title;
    const response = await searchConcerts(
      artistName,
      organizer,
      date,
      category,
      title
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

//Favorites
router.put("/concert-to-favorites/:id", authorization, async (req, res) => {
  try {
    const concertId = req.params.id;
    const user = req.verifiedUser;
    const response = await addToFavorites(user, concertId);
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.delete(
  "/concert-from-favorites/:id",
  authorization,
  async (req, res) => {
    try {
      const concertId = req.params.id;
      const user = req.verifiedUser;
      const response = await removeFromFavorites(user, concertId);
      if (response.error) {
        res.status(response.error.code).json(response.error.message);
      } else {
        res.json(response);
      }
    } catch (err) {
      res.status(500).json("Server Error");
    }
  }
);

//Subscriptions
router.put("/concert-to-subscriptions/:id", authorization, async (req, res) => {
  try {
    const concertId = req.params.id;
    const user = req.verifiedUser;
    const response = await addToSubscriptions(user, concertId);
    if (response.error) {
      res.status(response.error.code).json(response.error.message);
    } else {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.delete(
  "/concert-from-Subscriptions/:id",
  authorization,
  async (req, res) => {
    try {
      const concertId = req.params.id;
      const user = req.verifiedUser;
      const response = await removeFromSubscriptions(user, concertId);
      if (response.error) {
        res.status(response.error.code).json(response.error.message);
      } else {
        res.json(response);
      }
    } catch (err) {
      res.status(500).json("Server Error");
    }
  }
);

module.exports = router;
