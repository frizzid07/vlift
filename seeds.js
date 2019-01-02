var mongoose = require("mongoose");
var Job = require("./models/job");
var Bid = require("./models/bid");

var data = [
    {
        title: "Software Developer",
        image: "https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description : "A website to connect Service Professionals & Customers with each other!"
    },
    {
        title: "Architect",
        image: "https://images.pexels.com/photos/1537008/pexels-photo-1537008.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description : "An office by the beach"
    }
];

function seedDB() {
    // Remove all treks
    // Job.deleteMany({}, function(err) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         console.log("Job(s) Removed!");
    //     }
        // Add Treks
        data.forEach(function(seed) {
            Job.create(seed, function(err, job) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Job Created!");
                    // Add Comments
                    Bid.create({
                        description: "I love coding!",
                        author: {
                            username: "Admin"
                        }
                    }, function(err, bid) {
                        if(err) {
                            console.log(err);
                        } else {
                            job.bids.push(bid);
                            job.save();
                            console.log("New Bid Created!");
                        }
                    });
                }
            });
        // });
    });
}

module.exports = seedDB;