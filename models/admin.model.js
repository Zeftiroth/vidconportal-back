const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    adminName: {
        firstName: String,
        lastName: String
                },
    email: { type: String},
    password: { type: String},
    access: { type: String , default: 'admin'},
    profilePicture: { type: Buffer},


    
    
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
