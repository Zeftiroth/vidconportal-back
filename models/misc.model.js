const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const miscSchema = new Schema(
  {
    name: { type: String },
    address: { type: String },
    price: { type: Number },
    qty: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Misc = mongoose.model("Misc", miscSchema);

module.exports = Misc;
