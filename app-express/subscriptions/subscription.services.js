const res = require("express/lib/response");
const {
  updateUser,
  newSubEntity,
  updateSubEntity,
  getSubEntity,
} = require("./subscription.repo");

const newConcertInfos = async (user, eventId, subInfos) => {
  // console.log({ user, eventId, subInfos });
  const ownsEvent = ownsTheEvent(user.concerts, eventId);
  if (!ownsEvent) {
    return {
      error: {
        message: "You don't own this event",
        code: 401,
        title: "Permissions error",
      },
    };
  }
  const response = await newSubEntity(subInfos);

  if (response.status == 201) {
    return true;
  } else return false;
};

const updateConcertInfos = async (eventId, changes) => {
  try {
    const bodyChanges = {};
    //targer bodyChanges of form :
    //"changes":{
    // "startTickets":{"value":"heaalloi","type":"String"},
    // "stopTickets":{"value":"hello111","type":"String"},
    // "soldOut":{"value":true,"type":"Boolean"}
    // }
    for (const property in changes) {
      let type;
      switch (property) {
        case "soldOut":
          type = "Boolean";
          break;
        default:
          type = "String";
      }
      let value = changes[property];
      // console.log(`${property}: ${changes[property]}`);
      // console.log({ value, type });
      bodyChanges[property] = { value, type };
      bodyChanges[property].value = changes[property];
    }
    const response = await updateSubEntity(eventId, bodyChanges);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};

//helper functions
const ownsTheEvent = (events, eventId) => {
  let owns = false;
  events.forEach((event) => {
    if (event._id == eventId) {
      owns = event;
    }
  });
  return owns;
};

module.exports = { newConcertInfos, updateConcertInfos };
