const router = require('express').Router();
let Exhibitor = require('../models/exhibitor.model');
let Meeting = require('../models/meeting.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authExhibitor");

router.route('/').get((req, res) => {
    Exhibitor.find()
        .then(exhibitors => res.json(exhibitors))
        .catch(err => res.status(400).json('Error: ' + err));
});



router.post("/register", async (req, res) => {
  try {
    let {
      username,
      password,
      email,
      name,
      organization,
      designation,
      address,
      office,
      mobile,
      fax,
    } = req.body.postPackage;

    // validate

    if (!email || !password || !username || !name || !organization || !designation || !address || !office || !mobile || !fax)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 4)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 4 characters long." });


    const existingExhibitor = await Exhibitor.findOne({ email: email });
    if (existingExhibitor)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });



    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newExhibitor = new Exhibitor({
      email,
      password: passwordHash,
      username,
      name,
      organization,
      designation,
      address,
      office,
      mobile,
      fax,
      diet
    });
    const savedExhibitor = await newExhibitor.save();
    res.json(savedExhibitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const exhibitor = await Exhibitor.findOne({ email: email });
    if (!exhibitor)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const isMatch = await bcrypt.compare(password, exhibitor.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: exhibitor._id }, process.env.JWT_SECRET);
    res.json({
      token,
      data: exhibitor.data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedExhibitor = await Exhibitor.findByIdAndDelete(req.exhibitor);
    res.json(deletedExhibitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const exhibitor = await Exhibitor.findById(verified.id);
    if (!exhibitor) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/checkLoggedIn", auth, async (req, res) => {
  const exhibitor = await Exhibitor.findById(req.exhibitor);
  res.json({
    data: exhibitor
  });
});

// router.get("/", auth, async (req, res) => {
//   const exhibitor = await Exhibitor.findById(req.exhibitor);
//   res.json({
//     displayName: exhibitor.displayName,
//     id: exhibitor._id,
//   });
// });

router.get("/:id", auth, async (req, res) => {
  const exhibitor = await Exhibitor.findById(req.params.id);
  res.json(exhibitor);
});

router.route("/update/:id").post(async (req, res) => {
  try {
    let {
      username,
      // password,
      email,
      name,
      organization,
      designation,
      address,
      office,
      mobile,
      fax,
    } = req.body;

    if (
      !email ||
      
      !username ||
      !name ||
      !organization ||
      !designation ||
      !address ||
      !office ||
      !mobile ||
      !fax
    ) {
      return res.status(400).json({ error: "not all fields provided" });
    }

    await Exhibitor.findByIdAndUpdate(
      req.params.id,
      {
        username,
        // password,
        email,
        name,
        organization,
        designation,
        address,
        office,
        mobile,
        fax,
        diet
      },
      { new: true },
      function (err, docs) {
        if (err) {
          console.log(err.message);
          res.status(400).json({ error: err.message });
        } else {
          console.log("Updated User : ", docs);
          res.json(docs);
        }
      }
    );

    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/m", (req, res) => {
  try {
    // console.log("try");
    let meetingList =  Meeting.find();
    console.log(meetingList);
    res.json({ msg: "reached" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ err: error.message });
  }
});

module.exports = router;