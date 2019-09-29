var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
    
        }    
    });    
});
//comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    //1) lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //2) Creation of comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Campground not found");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                      
                    //3) Linking of comments and campground
                    campground.comments.push(comment);
                    campground.save();
                    //4)Redirect somewhere
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });
            
        }
    });
});
//Edit comment route
router.get("/:idcomment/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground)
    {
        if(err || !foundCampground){
            req.flash("error", "No Cmapground found");
            return res.redirect("back"); 
        } else {
            Comment.findById(req.params.idcomment, function(err, foundComment){
                if(err){
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {campground: req.params.id, comment: foundComment});
                }
            });
        }
    }); 
});

//Update Comment Route
router.put("/:idcomment",middleware.checkCommentOwnership, function (req, res) {
    
            Comment.findByIdAndUpdate(req.params.idcomment, req.body.comment, function (err, updateComment) {
                if (err) {
                    res.redirect("back");
                } else {
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
         });

//Destroy comment route
router.delete("/:idcomment", middleware.checkCommentOwnership, function (req, res) {
   
            Comment.findByIdAndDelete(req.params.idcomment, function (err) {
                if (err) {
                    res.redirect("back");
                } else {
                    req.flash("success", "Comment deleted");                    
                    res.redirect("/campgrounds/"+ req.params.id);
                }
            });
  });

module.exports = router;
