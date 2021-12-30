const {
  updateUser,
  updateConcert,
  deleteConcert,
  updateConcertFromId,
  findConcertById,
} = require("./eventOrganizer.repo");
const {
  newSubEntity,
  deleteSubEntity,
} = require("../subscriptions/subscription.repo");

const {
  updateConcertInfos,
} = require("../subscriptions/subscription.services");

const createAnEvent = async (user, event) => {
  event.organizer = user.username;
  console.log({ event });
  // console.log({ user, event });
  //create concert
  const updatedConcert = await updateConcert(event);
  user.concerts.push(updatedConcert);
  //update user
  const updatedUser = await updateUser(user);
  //create sub event
  updatedConcert.eventId = updatedConcert._id;
  // console.log(updatedConcert);
  const newSub = await newSubEntity(updatedConcert);
  const response = { user: updatedUser, new_event: updatedConcert };
  return response;
};

const deleteAnEvent = async (user, eventId) => {
  try {
    //check user own that event
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
    //remove concert
    user.concerts = removeFromArray(user.concerts, eventId);
    //update db
    updatedUser = await updateUser(user);
    const deletedConcert = await deleteConcert(eventId);
    const deletedSub = await deleteSubEntity(eventId);
    const response = { user: updatedUser };
    return response;
  } catch (error) {
    console.error(error);
  }
};

const updateAnEvent = async (user, eventId, event) => {
  try {
    //check user own that event
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
    //find last stored event
    const previousConcert = await findConcertById(eventId);
    //remove from array the old event
    user.concerts = removeFromArray(user.concerts, eventId);
    //update db pt.1
    const updatedConcert = await updateConcertFromId(eventId, event);
    //add the new one with the old id
    event._id = eventId;
    user.concerts.push(updatedConcert);
    //update db pt.2
    const updatedUser = await updateUser(user);
    //subscriptions
    const changes = {};
    for (const property in updatedConcert) {
      if (
        property == "startTickets" ||
        property == "stopTickets" ||
        property == "soldOut"
      ) {
        if (updatedConcert[property] != previousConcert[property]) {
          changes[property] = updatedConcert[property];
        }
      }
    }
    if (Object.keys(changes).length > 0) {
      console.log("we are gonna change the orion object");
      await updateConcertInfos(eventId, changes);
    }
    return { user: updatedUser, updatedConcert };
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

const removeFromArray = (events, eventId) => {
  events = events.filter((event) => {
    return event._id != eventId;
  });
  return events;
};

module.exports = { createAnEvent, deleteAnEvent, updateAnEvent };
