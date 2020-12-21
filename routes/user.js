const router = require("express").Router();
let User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authUser");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

// router.route('/add').post((req, res) => {
//     let {username, password, email} = req.body;
//     const salt = await bcrypt.genSalt();
//     const passwordHash = await bcrypt.hash(password, salt);

//     const newUser = new User({ username, password: passwordHash, email});

//     newUser.save()
//         .then(() => res.json('User added!'))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

router.post("/register", async (req, res) => {
  try {
    let { username, password, email } = req.body.postPackage;
    console.log(username);

    // validate

    if (!email || !password || !username)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 4)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 4 characters long." });
    // if (password !== passwordCheck)
    //   return res
    //     .status(400)
    //     .json({ msg: "Enter the same password twice for verification." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    // if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      username,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body.postPackage;

    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    console.log(req.query);
    const deletedUser = await User.findByIdAndDelete(req.query.user);

    res.json(deletedUser);
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

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/checkLoggedIn", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.json({
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/update/:id").post(async (req, res) => {
  try {
    let { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: "not all fields provided" });
    }

    await User.findByIdAndUpdate(
      req.params.id,
      {
        username: username,
        email: email,
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

    // let updatedDetails = {
    //   email: email,

    //   username: username,
    // }
    // let updateUser = await User.findById(req.params.id);

    // const editedUser = await updateUser.save(updatedDetails);
    // res.json(editedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
