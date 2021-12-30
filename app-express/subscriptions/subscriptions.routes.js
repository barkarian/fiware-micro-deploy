const router = require("express").Router();
const authorizationEO = require("../eventOrganizer/eventOrganizer.authorization");
const {
  newConcertInfos,
  updateConcertInfos,
} = require("./subscription.services");
const { getSubEntity } = require("./subscription.repo");
const { User, Concert } = require("../mongodb");

router.post("/:attr_id", async (req, res) => {
  try {
    const attributeId = req.params.attr_id;
    const { data } = req.body;
    const changes = await getSubEntity(data[0].id);
    console.log({ changes });
    const concertId = changes.id;
    delete changes.type;
    delete changes.id;
    await notifySubUsers(concertId, changes);
    res.json("hello");
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

// {
//   concertId: String,
//   notifData: String,
//   notifType: String,
//   notifSeen: Boolean,
//   notifDate: String,
// },
const notifySubUsers = async (concertId, changes) => {
  //find all user that they are subscribe to this concert
  console.log({ msg: "ORION GIVE US:", concertId, changes });
  const users = await User.find({ "concertSubscriptions._id": concertId });
  const d = new Date();
  let notifDate = d.toString();
  if (users.length == 0) {
    return;
  }
  let notification = {
    concertId,
    notifData: `We got changes on your subscribed event: ${JSON.stringify(
      changes
    )}`,
    notifType: "Changes",
    notifSeen: false,
    notifDate,
  };
  const qeeryRes = await User.updateMany(
    { "concertSubscriptions._id": concertId },
    { $push: { notifications: notification } },
    { new: true }
  );
  console.log({ qeeryRes });
  console.log({ users, notification });
};

module.exports = router;
