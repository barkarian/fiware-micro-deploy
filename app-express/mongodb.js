const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    roles: [
      {
        name: String,
        id: String,
      },
    ],
    confirmed: {
      type: Boolean,
      required: true,
    },
    concerts: [
      {
        _id: String,
        title: String,
        img: String,
        date: String,
        artistName: String,
        category: String,
        startTickets: String,
        stopTickets: String,
        soldOut: Boolean,
      },
    ],
    favorites: [
      {
        _id: String,
      },
    ],
    concertSubscriptions: [
      {
        _id: String,
      },
    ],
    notifications: [
      {
        concertId: String,
        notifData: String,
        notifType: String,
        notifSeen: Boolean,
        notifDate: String,
      },
      {
        timestamps: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const concertSchema = new Schema(
  {
    title: { type: String, required: true },
    organizer: { type: String, required: false },
    img: { type: String, required: false },
    date: { type: String, required: true },
    artistName: { type: String, required: true },
    category: { type: String, required: true },
    startTickets: { type: String, required: true },
    stopTickets: { type: String, required: true },
    soldOut: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
const Concert = mongoose.model("Concert", concertSchema);

const connectToMongo = async () => {
  try {
    const mongoResponse = await mongoose.connect(
      "mongodb://mongodb:27017/NewDb"
    );
    console.log({
      msg: "We connect to Mongo (via Mongoose module):",
      // mongoResponse
    });
  } catch (err) {
    console.log("we got an error trying to connect to mongodb:");
    console.error(err.message);
  }
};

module.exports = { connectToMongo, User, Concert };
