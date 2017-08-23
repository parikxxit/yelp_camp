var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride= require("method-override"),
    Campground    = require("./models/campgrounds.js"),
    Comments      = require("./models/comment.js"),
    User          = require("./models/user.js"),
    seedDB        = require("./seeds"),
    flash         = require("connect-flash"),
    geocoder = require('geocoder');

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes   = require("./routes/index");
    
// CONNECT to mongoose
mongoose.connect("mongodb://singhp154:parikshit@ds013569.mlab.com:13569/yelp_camp");
// mongoose.connect("mongodb://localhost/yelp_camp_final");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "this could be any thing",
    resave : false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seedDB(); //seed files for data base 

//Custom Middlewares to get user detail in templates
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   app.locals.moment = require('moment');
   next();
});

//ROUTES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Yelp camp is online");
});