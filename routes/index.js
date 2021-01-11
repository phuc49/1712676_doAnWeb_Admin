var express = require("express");
var router = express.Router();
var users = require("../controller/users.controller");
const passport = require("../passport");

router.get("/", function (req, res, next) {
  res.render("login");
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/?error=wrong-password",
    failureFlash: false,
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/account", users.account);
router.post("/account", users.editAdmin);

module.exports = router;
