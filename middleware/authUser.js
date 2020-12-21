const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    // console.log(token);
    if (!token) return res.status(401).json({ msg: `no auth token` });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      res.status(401).json({ msg: `verify token failed` });
    }
    req.user = verified.id;
    console.log(req.user);

    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
