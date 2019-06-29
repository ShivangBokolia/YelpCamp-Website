var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Campground Middleware
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");    
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You are not allowed to perform the certain activity");
                    res.redirect("back");
                }
            }
        });
    } else {        
        req.flash("error", "You need to be Logged In");
        res.redirect("back");
    }
};

//comment middleware
middlewareObj.checkCommentOwnerShip = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You are not allowed to perform the certain activity");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be Logged In");
        res.redirect("back");
    }
};

//Logged in middleware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged In");
    res.redirect("/login");
};



module.exports = middlewareObj;