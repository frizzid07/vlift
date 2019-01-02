var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");

// Landing
router.get("/", function(req, res) {
    res.render("landing");
});

// Login
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
        successRedirect: "/jobs",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res) {
    req.flash("success", "Logged in Successfully!");
});

// Register
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to VLift, " + user.username);
            res.redirect("/jobs");
        });
    });
});

// Logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out Successfully!");
    res.redirect("/jobs");
});

module.exports = router;