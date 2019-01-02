var express = require("express");
var router = express.Router({mergeParams: true});
var Job = require("../models/job");
var middleware = require("../middleware");

// Show Jobs
router.get("/", function(req, res) {
    Job.find({}, function(err, allJobs) {
        if(err) {
            req.flash("error", "Jobs could not be loaded!");
            req.redirect("/");
        }
        else {
            res.render("jobs/index", {jobs: allJobs});
        }
    });
});

// Post New Job Info
router.post("/", middleware.isLoggedIn, function(req, res) {
    var title = req.body.title;
    var image = req.body.image;
    var salary = req.body.salary;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newJob = {title: title, image: image, salary: salary, description: desc, author: author, accepted: false};
    Job.create(newJob, function(err, newDesg) {
        if (err) {
            req.flash("error", "Job could not be added!");
            res.redirect("/jobs/new");
        } else {
            req.flash("success", "Job added successfully!");
            res.redirect("/jobs");
        }
    });
});

// Show New Job Form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("jobs/new");
});

// Show Job Info
router.get("/:id", function(req, res) {
    Job.findById(req.params.id).populate("bids").exec(function(err, foundJob) {
        if (err) {
            console.log(err);
        } else {
            res.render("jobs/show", {job: foundJob});
        }    
    });
});

// Edit
router.get("/:id/edit", middleware.checkJobOwnership, function(req, res) {
    Job.findById(req.params.id, function(err, foundJob) {
        if(err) {
            req.flash("error", "Job not found!");
            res.redirect("back");
        } else {
            res.render("jobs/edit", {job: foundJob});
        }
    });
});

// Update
router.put("/:id", middleware.checkJobOwnership, function(req, res) {
    Job.findByIdAndUpdate(req.params.id, req.body.job, {new: true}, function(err, updatedJob) {
        if(err) {
            req.flash("error", "Job could not be edited!");
            res.redirect("/jobs");
        } else {
            req.flash("success", "Job edited successfully!");
            res.redirect("/jobs/" + req.params.id);
        }
    });
});

// Destroy
router.delete("/:id", middleware.checkJobOwnership, function(req, res) {
    Job.findByIdAndRemove(req.params.id, {new: true}, function(err) {
        if(err) {
            req.flash("error", "Job could not be deleted!");
            res.redirect("/jobs");
        }
        else {
            req.flash("success", "Job deleted successfully!");
            res.redirect("/jobs");
        }
    });
});

// Reject
router.post("/:id/reject", middleware.checkJobOwnership, function(req, res) {
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
            var newJob = {title: title, image: image, salary: salary, description: desc, author: author, accepted: false};
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
                    req.flash("success", "Bid rejected successfully!");
                }
            });
        }
    });
});

module.exports = router;