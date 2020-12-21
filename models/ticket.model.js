const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    description: {
      type: String,
      default: "Thankyou for purchasing a ticket to our event",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "Exhibitor",
    },
    price: { type: Number },
    exhibition: { type: Schema.Types.ObjectId, ref: "Exhibition" },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
