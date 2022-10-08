var express = require("express");
var router = express.Router();

var blog = require("../modules/post.js");

router.get("/",function(req,res){
    //res.json({"message":"This is Blog"});
    var data = blog.getAllPost();

    data.then(function(posts){
        var result = {
            posts: posts,
            error: false
        }

        res.render("blog/index",{data:result});
    }).catch(function(err){
        var result = {
            err: "Could not get data"
        }

        res.render("blog/index",{data:result});
    });

   // res.render("blog/index");
});

router.get("/post/:id",function(req,res){
    var id = req.params.id;
    var data = blog.getPostById(id);

    data.then(function(posts){
        var post = posts[0];

        var result = {
            post: post,
            error: false
        }

        res.render("blog/post",{data:result});
    }).catch(function(err){
        var result = {
            error: "Could not get post detail"
        }

        res.render("blog/post",{data:result});
    });
});

router.get("/about",function(req,res){
    res.render("blog/about");
});

module.exports = router;