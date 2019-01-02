// Declarations
var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    MongoDBStore = require('connect-mongodb-session'),
    store = new MongoDBStore({
        uri: "mongodb://frizzid:frizzid303@ds227939.mlab.com:27939/vlift",
        databaseName: "vlift"
    }),
    passportLocal = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    express = require("express"),
    app = express();

// Models
var Job = require("./models/job"),
    Bid = require("./models/bid"),
    User = require("./models/user");

// Routes
var jobRoutes = require("./routes/jobs"),
    bidRoutes = require("./routes/bids"),
    indexRoutes = require("./routes/index");

// Connection
mongoose.connect("mongodb://frizzid:frizzid303@ds227939.mlab.com:27939/vlift", {useNewUrlParser: true});
// mongodb://localhost/vlift
mongoose.set('useFindAndModify', false);

// Default Settings
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// Passport Config
app.use(require("express-session")({
    secret: "abc",
    store: store,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routing
app.use(indexRoutes);
app.use("/jobs", jobRoutes);
app.use("/jobs/:id/bids", bidRoutes);

// Setting up Port
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("VLift Server is Active!");
});