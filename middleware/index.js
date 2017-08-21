var Campground  = require("../models/campgrounds");
var Comments    = require("../models/comment");
//all middleware gose here
var middlewareObj = {
    
};

middlewareObj.checkUserOwnership = function(req, res, next){
        //check user is logged in
    if (req.isAuthenticated() || currentUser.isAdmin) {
        Campground.findById(req.params.id, function(err, findCampground){
       if (err) {
           req.flash("error", "Campground dose not found")
           res.redirect("back");
       } else{            req.flash("error", "You need to login to do that");

           //user owns the campground
           if (findCampground.author.id.equals(req.user._id)  || req.user.isAdmin) {
                next();               
           } else {
               req.flash("error", "You are not authorized to do that");
               //else redirect it somewhere
                res.redirect("back");
           }
       }
    });
    } else  {
        req.flash("error", "You need to login to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership= function(req, res, next){
        //check user is logged in
        if (req.isAuthenticated()|| currentUser.isAdmin) {
            Comments.findById(req.params.comment_id, function(err, findComment){
        if (err) {
            req.flash("error", "You dive to unexpected page");
           res.redirect("back");
        } else{
           //user owns the campground
        //   console.log(findComment);
           if (findComment.author.id.equals(req.user._id) || currentUser.isAdmin) {
                next();               
           } else {
               req.flash("error", "You don't have permission to do that");
               //else redirect it somewhere
                res.redirect("back");
           }
       }
    });
    } else  {
        req.flash("error", "You need to login to do that");
        res.redirect("back");
    }
};
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to login to do that");
    res.redirect("/login");
};
module.exports = middlewareObj;