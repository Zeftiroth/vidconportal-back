const router = require('express').Router();
let Chat = require('../models/chat.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authUser");
let User = require("../models/user.model")

router.post("/:id", auth, async (req, res) => {
  try {
      let {sender, receiver, content} = req.body
      if (!content || !sender || !receiver) {
          res.status(400).json({message: "Not all fields are entered."})
      }
      const newChat = new Chat({
          sender,
          receiver,
          content,
      })
      const savedChat = await newChat.save();
      res.json(savedChat)
      
  } catch (error) {
      res.status(500).json({error: error.message})
  }


  
});

router.get("/:id", auth, async (req, res) => {
    try {
        let user = await (await User.findById(req.user)).populate("chat")
        if (!user) {
            res.status(400).json({error: "User not found"})
        }
        res.json(user)



    } catch (error) {
        res.status(500).json({error: error.message})
        
    }
})




module.exports = router;