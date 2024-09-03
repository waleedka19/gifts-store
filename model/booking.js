const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  giftName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
