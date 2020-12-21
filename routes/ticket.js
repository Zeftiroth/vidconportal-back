const router = require("express").Router();
let Ticket = require("../models/ticket.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authUser");
const { all } = require("./exhibition");

router.get("/", auth, async (req, res) => {
  try {
    let allTickets = await Ticket.find().populate([
      // {
      //   path: "owner",
      //   model: "Exhibitor",
      // },
      {
        path: "exhibition",
        model: "Exhibition",
      },
    ]);
    // let allTickets = await Ticket.find();
    console.log({ allTickets: allTickets });
    if (!allTickets) {
      res.status(400).json({ message: "No tickets found" });
    }
    res.json(allTickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    let { description, price, owner, exhibition } = req.body;
    if (!description || !price || !owner || !exhibition) {
      res.status(400).json({ message: "Not all fields are entered." });
    }
    const newTicket = new Ticket({
      description,
      price,
      owner,
      exhibition,
    });
    const savedTicket = await newTicket.save();
    res.json(savedTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    let oneTicket = await Ticket.findById(req.params.id);
    if (!oneTicket) {
      res.status(400).json({ error: "Ticket not found" });
    }
    res.json(oneTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
