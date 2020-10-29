const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        
        unique: true,
        
        minlength: 4
    },
    password: { type: String, minlength: 4 },
    email: { type: String, unique: true },
    profileData: { 
        firstName: {type: String},
        lastName: {type: String },
        phone: {type: Number },
        address: {type: String },
        picture: {type: String},

    },
    tickets: [{type: Schema.Types.ObjectId, ref: "Ticket"}],
    chats: [{type: Schema.Types.ObjectId, ref: "Chat"}],
    access: {type: String, default:"user"}


}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;