const router = require("express").Router();
let Misc = require("../models/misc.model");

router.post("/", async (req, res) => {
  try {
    let { name, address, price, qty } = req.body;

    const newMisc = new Misc({
      name,
      address,
      price,
      qty,
    });
    const savedMisc = await newMisc.save();
    res.json(savedMisc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/").get((req, res) => {
  Misc.find()
    .then((misc) => res.json(misc))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
