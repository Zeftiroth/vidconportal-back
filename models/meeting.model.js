const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const meetingSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 1 },
    body: { type: String, required: true, minlength: 1 },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    receiver: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exhibitor",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
