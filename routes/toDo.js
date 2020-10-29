const  router = require("express").Router()
const auth = require("../middleware/auth")
const Todo = require("../models/todo.model")

router.post("/", auth, async (req, res) => {
    try{
        const {title} = req.body
        console.log(title)

        if (!title)
        return res.status(400).json({msg: "Title missing"})

        const newTodo = new Todo({
            title,
            adminID: req.admin
        })

        const savedTodo = await newTodo.save()
        res.json(savedTodo)

    } catch(err) {
        res.status(500).json({ error: err.message });
    }

})

router.get('/', auth, async (req, res) => {
    try {
        const todos = await Todo.find({adminID: req.admin})
        res.json(todos)
    } catch (error) {
        res.status(500).json({msg:error.message})
        
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOne({adminID: req.admin, _id: req.params.id})
        if (!todo) {
            return res.status(404).json({msg:"no todo list in this admin"})
        }
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id)
        res.json(deletedTodo)
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
})

module.exports = router