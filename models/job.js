var mongoose = require("mongoose");

var jobSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        username: String
    },
    bids: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Bid"
        }
    ],
    created: {type: Date, default: Date.now},
    accepted: Boolean
});

module.exports = mongoose.model("Job", jobSchema);