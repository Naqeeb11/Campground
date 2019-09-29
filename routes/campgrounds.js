var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//INDEX - show all campgrounds
router.get("/", function(req, res){
   //Get all campgrounds from DB
   Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index", {campgrounds: allCampgrounds});
       }
   });      
});

router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var newCampgrounds= {name: name , price: price, image: image, description: description, author: author};
  //create a new campground and save to DB  
  Campground.create(newCampgrounds, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else {
          res.redirect("/campgrounds");
      }
  });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new");
});

//to show description of campground
router.get("/:id", function (req, res) {
  //find the campground with provided id
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
      if (err || !foundCampground) {
          req.flash("error", "Campground not found");
          res.redirect("back");
      } else {
          //render show template with that campground
          res.render("campgrounds/show", {campground: foundCampground});
      }
  });
});

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findOneAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+updateCampground._id);
        }
    });
});
 
//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findOneAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;