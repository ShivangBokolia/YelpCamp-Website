var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

router.get("/", function(req, res){   //INDEX ROUTE
    Campground.find({}, function(err, AllCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index.ejs", {campgrounds: AllCampground});
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {  //NEW ROUTE 
   res.render("campgrounds/new.ejs") ;
});

router.post("/", middleware.isLoggedIn, function(req, res){     //CREATE ROUTE
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampGround = {name: name, price: price, image: image, description: desc, author: author};
    Campground.create(newCampGround, function(err, newlycreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
    // campgrounds.push(newCampGround);
});

router.get("/:id", function(req, res){         //SHOW ROUTE 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show.ejs", {campground: foundCampground});
        }
    });
}); 

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit.ejs", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;