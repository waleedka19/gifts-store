const User = require("../model/user");
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch((err) => {
      console.log("Error retrieving user:", err);
      next(err);
    });
};
