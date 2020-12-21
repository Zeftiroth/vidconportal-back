const mongoose = require("mongoose");
const ExhibitorSchema = require("./exhibitor.model").schema;
const Schema = mongoose.Schema;

const exhibitionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      unique: true,
    },
    description: { type: String },
    date: { type: Date, required: true },
    ticket: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
    venue: { type: String },
    price: { type: Number },
    link: { type: String },
    exhibitor: {
      type: [Schema.Types.ObjectId],
      ref: "Exhibitor",
      // autopopulate: true,
    },

    // exhibitor: [ExhibitorSchema],
  },
  {
    timestamps: true,
  }
);
// exhibitionSchema.plugin(require("mongoose-autopopulate"));
const Exhibition = mongoose.model("Exhibition", exhibitionSchema);

module.exports = Exhibition;
