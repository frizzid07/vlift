var express = require("express");
var router = express.Router({mergeParams: true});
var Job = require("../models/job");
var Bid = require("../models/bid");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Job.findById(req.params.id, function(err, job) {
        if(err) {
            console.log(err);
        } else {
            res.render("bids/new", {job: job});
        }
    });
});

router.post("/", function(req, res) {
    Job.findById(req.params.id, function(err, job) {
        if(err) {
            console.log(err);
            res.redirect("/jobs");
        } else {
            Bid.create(req.body.bid, function(err, bid) {
                if (err) {
                    console.log(err);
                } else {
                    // Add Username to Bid
                    bid.author.id = req.user._id;
                    bid.author.username = req.user.username;
                    bid.save();
                    job.bids.push(bid);
                    job.save();
                    req.flash("success", "Bid added successfully!");
                    res.redirect("/jobs/" + job._id);
                }            
            });
        }
    });
});

// Edit
router.get("/:bid_id/edit", middleware.checkBidOwnership, function(req, res) {
    Bid.findById(req.params.bid_id, function(err, foundBid) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("bids/edit", {job_id: req.params.id, bid: foundBid});
        }
    });
});

// Update
router.put("/:bid_id", middleware.checkBidOwnership, function(req, res) {
    Bid.findByIdAndUpdate(req.params.bid_id, req.body.bid, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment edited successfully!");
            res.redirect("/jobs/" + req.params.id);
        }
    });
});

// Delete
router.delete("/:bid_id", middleware.checkBidOwnership, function(req, res) {
    Bid.findByIdAndRemove(req.params.bid_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted successfully!");
            res.redirect("/jobs/" + req.params.id);
        }
    });
});

// Accept
router.post("/:bid_id", middleware.checkJobOwnership, function(req, res) {
    Job.findById(req.params.id, function(err, job) {
        if(err) {
            console.log(err);
            res.redirect("/jobs");
        } else {
            var title = job.title;
            var image = job.image;
            var salary = job.salary;
            var desc = job.description;
            var author = {
                id: req.user._id,
                username: req.user.username
            };
            var newJob = {title: title, image: image, salary: salary, description: desc, author: author, accepted: true};
            Job.findByIdAndRemove(job._id, {new: true}, function(err) {
                if(err) {
                    req.flash("error", "Bid unsuccessful!");
                    res.redirect("/jobs");
                }
                else {
                    res.redirect("/jobs");
                }
            });
            Job.create(newJob, function(err, newDesg) {
                if (err) {
                    req.flash("error", "Bid Unsuccessful!");
                    res.redirect("/jobs");
                } else {
                    req.flash("success", "Bid successfull!");
                }
            });        
        }
    });
});

module.exports = router;