const fetch = require("node-fetch");
const { Concert } = require("../mongodb");

const findConcerts = async (searchTerms) => {
  try {
    const queryRes = await Concert.find(searchTerms).exec();
    return queryRes;
  } catch (err) {
    console.error(err);
  }
};

const pushToFavorites = async (userId, newConcertId) => {
  try {
    const queryRes = await Concert.updateOne(
      { _id: userId },
      { $push: { favorites: [newConcertId] } },
      { new: true }
    );
    return queryRes;
  } catch (err) {
    console.error(err);
  }
};

const findManyConcertsByIds = async (concertsIds) => {
  try {
    const array = [];
    for (el of concertsIds) {
      array.push(el._id);
    }
    const queryRes = await Concert.find({ _id: { $in: array } });
    return queryRes;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { findConcerts, pushToFavorites, findManyConcertsByIds };
