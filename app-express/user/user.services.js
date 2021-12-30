const {
  findConcerts,
  pushToFavorites,
  findManyConcertsByIds,
} = require("./user.repo");
const { updateUser } = require("../eventOrganizer/eventOrganizer.repo");

const searchConcerts = async (artistName, organizer, date, category, title) => {
  if (title) {
    title = { $regex: title, $options: "i" };
  }
  if (category) {
    category = { $regex: category, $options: "i" };
  }
  if (artistName) {
    artistName = { $regex: artistName, $options: "i" };
  }
  if (organizer) {
    organizer = { $regex: organizer, $options: "i" };
  }
  if (date) {
    date = { $regex: date, $options: "i" };
  }
  const searchFilters = { artistName, organizer, date, category, title };
  Object.keys(searchFilters).forEach(
    (key) => searchFilters[key] === undefined && delete searchFilters[key]
  );
  const concerts = findConcerts(searchFilters);

  return concerts;
};

const addToFavorites = async (user, concertId) => {
  try {
    user.favorites.push(concertId);
    const updatedUser = await updateUser(user);
    return { user: updatedUser, concertId };
  } catch (error) {
    console.error(error);
  }
};

const removeFromFavorites = async (user, concertId) => {
  try {
    console.log({ concertId });
    user.favorites = user.favorites.filter((favorite) => {
      return favorite._id != concertId;
    });
    const updatedUser = await updateUser(user);
    return { user: updatedUser, concertId };
  } catch (error) {
    console.error(error);
  }
};

const addToSubscriptions = async (user, concertId) => {
  try {
    user.concertSubscriptions.push(concertId);
    const updatedUser = await updateUser(user);
    return { user: updatedUser, concertId };
  } catch (error) {
    console.error(error);
  }
};

const removeFromSubscriptions = async (user, concertId) => {
  try {
    console.log({ concertId });
    user.concertSubscriptions = user.concertSubscriptions.filter(
      (subscription) => {
        return subscription._id != concertId;
      }
    );
    const updatedUser = await updateUser(user);
    return { user: updatedUser, concertId };
  } catch (error) {
    console.error(error);
  }
};

const findEventsByIds = async (concertsIds) => {
  try {
    console.log({ concertsIds });
    const events = await findManyConcertsByIds(concertsIds);
    return { events };
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  searchConcerts,
  addToFavorites,
  removeFromFavorites,
  addToSubscriptions,
  removeFromSubscriptions,
  findEventsByIds,
};
