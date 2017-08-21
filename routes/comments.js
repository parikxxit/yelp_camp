var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campgrounds");
var Comments    = require("../models/comment");
var middleware  = require("../middleware");

//new route
router.get("/new", middleware.isLoggedIn, function(req, res){
        Campground.findById(req.params.id, function(err, campground){
            if (err) {
                console.log(err);
            } else {
                // console.log(campground);
                res.render("comments/new", {campground: campground});
            }
        });
});

//CREATE ROUTE
router.post("/",middleware.isLoggedIn, function(req, res){
    //lookup campground using id
   Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            //create a new comment
            Comments.create(req.body.comment, function(err, newComment){
               if (err) {
                   req.flash("error", "Something went wrong if you face an issue please email us at contact@parikshitsingh.com");
                   console.log(err);
               } else{
                   //add username and id to the comment
                   newComment.author.id = req.user._id;
                   newComment.author.username = req.user.username;
                   //connect new comments to campground
                   newComment.save();
                   campground.comments.push(newComment);
                   campground.save();
                   req.flash("success", "Comment added Succesfully");
                   //redirect campground to show page
                   res.redirect('/campgrounds/' + campground._id);
               }
            });
            
            
        }
   });
});
//edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comments.findById(req.params.comment_id, function(err, comment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id : req.params.id, comment : comment});
        }
    });

});
//put route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "comment edited successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
// destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comments.findByIdAndRemove(req.params.comment_id, function(err, deleteComment){
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "commented deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;