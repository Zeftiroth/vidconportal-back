const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exhibitionSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        minlength: 1, 
        unique: true,
    },
    description: { type:String},
    date: {type:Date, required: true},
    ticket: { 
        type: Schema.Types.ObjectId, ref: "Ticket"

    },
    exhibitor: {
        type: Schema.Types.ObjectId, ref: "Exhibitor"
    }


}, {
    timestamps: true,
});

const Exhibition = mongoose.model('Exhibition', exhibitionSchema);

module.exports = Exhibition;