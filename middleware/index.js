var Job = require("../models/job");
var Bid = require("../models/bid");
var middlewareObj = {};

middlewareObj.checkJobOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Job.findById(req.params.id, function(err, foundJob) {
            if(err) {
                req.flash("error", "Job not found!");
                res.redirect("back");
            } else if(foundJob.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "User does not have the permission to do that!");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "User must be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkBidOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Bid.findById(req.params.bid_id, function(err, foundBid) {
            if(err) {
                res.redirect("back");
            } else if(foundBid.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "User does not have the permission to do that!");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "User must be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "User must be logged in to do that!");
    res.redirect("/login");
};

middlewareObj.requireRole = function(role) {
    return function(req, res, next) {
        if (req.user && req.user.role === role) {
            next();
        }
        else {
          res.sendStatus(404);
        }
    };
};

module.exports = middlewareObj;