const mongoose = require("mongoose")
const toDoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    adminID: {type: String, required: true}
})

module.exports = Todo = mongoose.model("todos", toDoSchema)