var express        = require("express");
var router         = express.Router();
var User           = require("../models/user.js");
var Campground     = require("../models/campgrounds.js");
var passport       = require("passport");
router.get("/", function(req, res){
   res.render("landing") ;
});

//SHOW REGISTER FORM

router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

//signup logic

router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar,
        email: req.body.avatar
    });
    // eval(require("locus"));
    if (req.body.adminCode === "secretCode123") {
        newUser.isAdmin = true;
    }
    
    User.register(newUser, req.body.password, function(err, user){
       if (err) {
           req.flash("error", err.message);
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "welcome glad to have you here " + user.username);
           res.redirect("/campgrounds");
       });
    });
});

//LOGIN Logic

router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});

router.post("/login",passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"

}),function(req, res){
});

//logout route

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "successfully logged out");
    res.redirect("/campgrounds");
});

//User Profile
router.get("/users/:id", function(req, res) {
   User.findById(req.params.id, function(err, foundUser){
       if (err) {
           req.flash("error", "Something Went wrong");
           res.redirect("back");
       } else {
           if (foundUser == null) {
               res.send("user has been deleted");
           } else{
               Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campground){
                   if (err) {
                        req.flash("error", "Something went wrong");
                        res.redirect("/");
                   } else {
                        res.render("users/profile", {user: foundUser, campground: campground});
                   }
               });
               
        }
       }
   });
});

module.exports = router;