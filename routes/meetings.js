const router = require("express").Router();
let Chat = require("../models/chat.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authUser");
let User = require("../models/user.model");
const generateSignature = require("../middleware/zoom");

router.post("/signature"),
  async (req, res) => {
    try {
      let { meetingNumber, role } = req.body;
      generateSignature(
        process.env.ZOOM_API_KEY,
        process.env.ZOOM_API_SECRET,
        meetingNumber,
        role
      );
      res.json(generateSignature);
      console.log(generateSignature);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = router;
