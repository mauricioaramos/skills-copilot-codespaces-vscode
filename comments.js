// Create web server with Node.js
// Created by Abhishek Singh on 18/06/2018

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Comments new
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log("Error: " + err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// Comments create
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log("Error: " + err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log("Error: " + err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment)
					campground.save();
					req.flash("success", "Successfully created comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// Comments edit
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, comment){
		if(err){
			console.log("Error: " + err);
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: comment});
		}
	});
});

// Comments update
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
		if(err){
			console.log("Error: " + err);
			res.redirect("back");
		} else {
			req.flash("success", "Successfully updated comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Comments destroy
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findById
