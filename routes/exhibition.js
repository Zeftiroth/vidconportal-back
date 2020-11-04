const router = require("express").Router();
let Exhibition = require("../models/exhibition.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    let { name, description, date, ticket, exhibitor } = req.body;
    if (!description || !name || !date) {
      res.status(400).json({ message: "Not all fields are entered." });
    }
    const newExhibition = new Exhibition({
      name,
      description,
      date,
      ticket,
      exhibitor,
    });
    const savedExhibition = await newExhibition.save();
    res.json(savedExhibition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    let allExhibition = await Exhibition.find().populate([
      {
        path: "ticket",
        model: "Ticket",
      },
      {
        path: "exhibitor",
        model: "Exhibitor",
      },
    ]);
    if (!allExhibition) {
      res.status(400).json({ message: "No tickets found" });
    }
    res.json(allExhibition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    let oneExhibition = await ExhiboneExhibition.findById(req.params.id);
    if (!oneExhibition) {
      res.status(400).json({ error: "Exhibition not found" });
    }
    res.json(oneExhibition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
