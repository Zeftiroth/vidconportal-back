const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    content: { type: String, required: true, minlength: 1},
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "Exhibitor",
    }


}, {
    timestamps: true,
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;