const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let Admin = require("../models/admin.model");
const auth = require("../middleware/auth");

router.route("/").get((req, res) => {
  Admin.find()
    .then((admin) => res.json(admin))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/login").post(async (req, res) => {
  try {
    let { email, password } = req.body;
    let reqEmail = await Admin.findOne({ email: email });

    if (!reqEmail) {
      return res.status(400).json({ msg: `Email is not registered` });
    }
    const isMatch = await bcrypt.compare(password, reqEmail.password);
    if (!isMatch) {
      return res.status(400).json({ msg: `Password does not match` });
    }

    const token = jwt.sign({ id: reqEmail._id }, process.env.JWT_SECRET);
    res.json({
      token,
      admin: {
        id: reqEmail._id,
        adminName: reqEmail.adminName,
        email: reqEmail.email,
      },
    });

    // const accessToken = jwt.sign(process.env.ACCESS_TOKEN_SECRET)
    //     if (reqEmail == null) {
    //         return res.status(400).send('Invalid email address')
    // }

    // res.status(200).send()
    // if (reqEmail.config.password == req.body.password) {

    //     res.status(200).send('lol')

    // }
    // else {
    //     res.status(400).send('Invalid password')
    // }
    // if
    // (bcrypt.compare(req.body.password, reqEmail.data.password)) {
    //     res.send('Success')

    // }
    // else {
    //     res.send('Not Allowed')
    //     }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.route("/add").post(async (req, res) => {
  const adminName = req.body.adminName;
  const email = req.body.email;
  //   const password = req.body.password
  const password = await bcrypt.hash(req.body.password, 10);

  const access = req.body.access;
  const profilePicture = req.body.profilePicture;
  //   const duration = Number(req.body.duration);
  //   const date = Date.parse(req.body.date);

  const newAdmin = new Admin({
    adminName,
    email,
    password,
    access,
    profilePicture,
    // duration,
    // date,
  });

  newAdmin
    .save()
    .then(() => res.json("Admin added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/checkLoggedIn", auth, async (req, res) => {
  const admin = await Admin.findById(req.admin);
  res.json({
    adminName: admin.adminName,
    id: admin._id,
  });
});

router.route("/:id").get((req, res) => {
  Admin.findById(req.params.id)
    .then((admin) => res.json(admin))
    .catch((err) => res.status(400).json("Error: " + err));
});

// router.route("/delete", auth).delete(async (req, res) => {
router.delete("/delete/", auth, async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.admin);
    console.log(req.admin);
    console.log(deletedAdmin);

    res.json({ msg: deletedAdmin });
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

    const admin = await Admin.findById(verified.id);
    if (!admin) return res.json(false);

    return res.json(true);
  } catch (error) {}
});

router.route("/update/:id").post((req, res) => {
  Admin.findById(req.params.id)
    .then((admin) => {
      admin.adminName = req.body.adminName;
      admin.email = req.body.email;
      admin.password = req.body.password;
      admin.access = req.body.access;
      admin.profilePicture = req.body.profilePicture;
      //   admin.duration = Number(req.body.duration);
      //   admin.date = Date.parse(req.body.date);

      admin
        .save()
        .then(() => res.json("Admin updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
