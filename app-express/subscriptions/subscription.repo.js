const fetch = require("node-fetch");
const { updateUser } = require("../eventOrganizer/eventOrganizer.repo");
const { updateUserFromId } = require("../admin/admin.repo");

const getSubscriptions = async () => {
  const response = await fetch(`http://orion:1026/v2/subscriptions`, {
    method: "get",
  });
  const parseRes = await response.json();
  // console.log(parseRes);
  return parseRes;
};

const createSubscription = async (triggerAttrs, callback_uri) => {
  let response = await fetch("http://orion:1026/v2/subscriptions", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: "Notify users when some concert details are changed.",
      subject: {
        entities: [{ idPattern: ".*", type: "ConcertSubInfos" }],
        condition: {
          attrs: triggerAttrs,
        },
      },
      notification: {
        http: {
          url: `http://app-express:5000/api/subscriptions/${callback_uri}`,
        },
        attrsFormat: "keyValues",
        onlyChangedAttrs: true,
        // attrs: [triggerAttrs],
      },
    }),
  });
  return response;
};

const newSubEntity = async (subInfos) => {
  const { startTickets, stopTickets, soldOut, eventId } = subInfos;
  const response = await fetch(
    "http://orion:1026/v2/entities?options=keyValues",
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: eventId,
        type: "ConcertSubInfos",
        startTickets: {
          value: startTickets,
          type: "String",
        },
        stopTickets: {
          value: stopTickets,
          type: "String",
        },
        soldOut: {
          value: soldOut,
          type: "Boolean",
        },
      }),
    }
  );
  return response;
};

const updateSubEntity = async (entityId, changes) => {
  const response = await fetch(
    `http://orion:1026/v2/entities/${entityId}/attrs`,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    }
  );
  return response;
};

const getSubEntity = async (entityId) => {
  const response = await fetch(
    `http://orion:1026/v2/entities/${entityId}?options=keyValues`,
    {
      method: "get",
    }
  );
  const entity = await response.json();
  return entity;
};

const deleteSubEntity = async (entityId) => {
  const response = await fetch(`http://orion:1026/v2/entities/${entityId}`, {
    method: "delete",
  });
  return response;
};

const ifNotificationHasJustSent = async (user) => {
  console.log({ msg: "inside ifNotificationHasJustSent", user });
  let notificationSent = false;
  for (let i = 0; i < user.notifications.length; i++) {
    console.log(user.notifications[i]);
    if (user.notifications[i].notifSeen == false) {
      notificationSent = true;
      user.notifications[i].notifSeen = true;
    }
  }
  if (notificationSent) {
    const queryRes = await updateUserFromId(user._id, {
      notifications: user.notifications,
    });
    console.log(queryRes.notifications);
  }
  return;
};

module.exports = {
  getSubscriptions,
  createSubscription,
  updateUser,
  newSubEntity,
  updateSubEntity,
  deleteSubEntity,
  getSubEntity,
  ifNotificationHasJustSent,
};
