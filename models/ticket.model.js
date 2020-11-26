const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      minlength: 1,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    exhibition: { type: Schema.Types.ObjectId, ref: "Exhibition" },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
