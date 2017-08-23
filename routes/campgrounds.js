var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campgrounds");
var middleware  = require("../middleware");
var geocoder    = require("geocoder");
//INDEX -All the pages
router.get("/", function(req, res){
    if (req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');

        //get all campgrounds from db
        Campground.find({name: regex}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                if (allCampgrounds.length < 1) {
                    req.flash("error", "No search result found for \"" + req.query.search + "\" please search again");
                    res.redirect("back");
                } else{
                    // var searchResult = "Search result for \"" + req.query.search + "\"";
                    // console.log(searchResult.length);
                    res.render("campgrounds/index", {campgrounds: allCampgrounds});   
                }
            }
        });
    } else {
        //get all campgrounds from db
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, page:'home'});
            }
        });
    }
});

//CREAT - Add places to the database
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  var cost = req.body.cost;
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, image: image, description: desc, cost: cost, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});
// router.post("/",middleware.isLoggedIn, function(req, res){
//   //get data from form add to campground array
//   var name = req.body.place;
//   var image = req.body.image;
//   var price = req.body.price;
//   var desc = req.body.description;
//   var author = {
//           id: req.user._id,
//           username: req.user.username
//      };
//     // console.log(req.user);
    
//   var newCampground = {name: name, image: image, description: desc, author: author, price: price};
//   //create a new campground and add it to database
//   Campground.create(newCampground,function(err,newlyCreated){
//       if (err) {
//           console.log(err);
//       } else {
//           console.log(newlyCreated);
//           //redirect to campgorund page
//           res.redirect("/campgrounds");    
//       }
//   });
// });


//NEW  - Form to add a new campground to the databases
router.get("/new",middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});
//SHOW - more info about campground
router.get("/:id", function(req, res){
    //find campgorund with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, findCampground){
        if(err){
            console.log(err);
        } else {
            // console.log(findCampground);
            //filter show template with campground
            res.render("campgrounds/show", {campground: findCampground});     
        }
    });
});
//EDIT ROUTE

router.get("/:id/edit", middleware.isLoggedIn,middleware.checkUserOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, findCampground){
         res.render("campgrounds/edit", {campground: findCampground});
        });
});
//UPDATE ROUTE

router.put("/:id", function(req, res){
   //find and update
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
      if (err) {
          console.log(err);
          res.redirect("/campgrounds");
      } else{
          req.flash("success", "Comment Succesfully Edited");
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

//Destroy route
router.delete("/:id",middleware.checkUserOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;