const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exhibitorSchema = new Schema(
  {
    username: {
      type: String,

      unique: true,

      minlength: 4,
    },
    password: { type: String, minlength: 4 },
    email: { type: String, unique: true },
    category: { type: String, default: "paying" },

    name: { type: String },
    organization: { type: String },
    designation: { type: String },
    address: { type: String },
    office: { type: String },
    mobile: { type: String },
    fax: { type: String },
    diet: { type: String, default: "non-vegetarian" },

    picture: { type: String },

    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    access: { type: String, default: "exhibitor" },
    exhibitions: [{ type: Schema.Types.ObjectId, ref: "Exhibition" }],
  },
  {
    timestamps: true,
  }
);

const Exhibitor = mongoose.model("Exhibitor", exhibitorSchema);

module.exports = Exhibitor;
// module.exports.exhibitorSchema = ExhibitorSchema;
