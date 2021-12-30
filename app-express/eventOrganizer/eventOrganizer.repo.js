const fetch = require("node-fetch");
const { User, Concert } = require("../mongodb");

const findConcertById = async (eventId) => {
  try {
    //find data from id
    const event = await Concert.findOne({ _id: eventId }).exec();
    console.log(event);
    return event;
  } catch (err) {
    console.error(err);
  }
};

const updateUser = async (userData) => {
  try {
    const user = new User(userData);
    const queryRes = await user.save();
    const updatedUser = queryRes.toObject();
    delete updatedUser._id;
    delete updatedUser.createdAt;
    delete updatedUser.updatedAt;
    delete updatedUser.__v;

    return updatedUser;
  } catch (err) {
    console.error(err);
  }
};

const updateConcert = async (concertData) => {
  try {
    const concert = new Concert(concertData);
    let queryRes = await concert.save();
    const updatedConcert = queryRes.toObject();
    delete updatedConcert.createdAt;
    delete updatedConcert.updatedAt;
    delete updatedConcert.__v;

    return updatedConcert;
  } catch (err) {
    console.error(err);
  }
};

const updateConcertFromId = async (concertId, modification) => {
  try {
    const queryRes = await Concert.findByIdAndUpdate(
      { _id: concertId },
      { $set: modification },
      { new: true }
    );
    // console.log(queryRes);
    return queryRes;
  } catch (err) {
    console.error(err);
  }
};

const deleteConcert = async (concertId) => {
  try {
    const queryRes = await Concert.deleteOne({ _id: concertId });
    return queryRes;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  updateUser,
  updateConcert,
  deleteConcert,
  updateConcertFromId,
  findConcertById,
};
