var express = require("express");
var user_mdl = require("../modules/user");
var post_mdl = require("../modules/post");
var helper = require("../helpers/helper");

var router = express.Router();

router.get("/",function(req,res){
   // res.json({"message":"This is Admin"});
    if(req.session.user){
    var post = post_mdl.getAllPost();

    post.then(function(post){
        // var data = {
        //     post: posts,
        //     error: false
        // }
        res.render("admin/dashboard",{data:{post}});
    }).catch(function(err){
        res.render("admin/dashboard",{data:{error:"Error"}});
    });
}
else{
    res.redirect("/admin/signin");
}
});

// doi tuong data trong
router.get("/signup",function(req,res){
    res.render("signup",{data:{}});
});

// bat loi 
router.post("/signup",function(req,res){
    var user = req.body;

    if(user.email.trim().length == 0 || user.passwd.trim().length == 0 || user.repasswd.trim().length == 0){
        res.render("signup",{data:{error: "Cannot be left blank"}})
    }

    if(user.passwd.trim() != user.repasswd.trim()){
        res.render("signup",{data:{error:"Is not Match"}});
    }

    var pass = helper.hash_password(user.passwd);

    //Insert data vao database
    user = {
        email: user.email,
        password: pass,
        first_name: user.firstname,
        last_name: user.lastname,
    };

    var result = user_mdl.addUser(user);
    
    result.then(function(data){
       // res.json({"message":"Insert Success"});
       res.redirect("/admin/signin");
    }).catch(function(err){
        res.render("signup",{data:{error:err}});
    });

    // if(!result){
    //     res.render("signup",{data:{error:"Could not insert DB"}});
    // }
    // else{
    //     res.json({"message":"OK"});
    // }
});

router.get("/signin",function(req,res){
    res.render("signin",{data:{}});
});

router.post("/signin",function(req,res){
    var params = req.body;

    if(params.loginname.trim().length == 0 || params.password.trim().length == 0){
        res.render("signin",{data:{error:"Please enter"}});
    }
    else{
        var email = user_mdl.getUserByEmail(params.loginname);

        if(email){
            email.then(function(data){
                var user = data[0];

                var status = helper.compare_pass(params.password,user.password);

                if(!status){
                    res.render("signin",{data:{error:"Password Wrong"}});
                }
                else{
                    req.session.user = user;
                    console.log(req.session.user);
                    res.redirect("/admin");
                }
            })
        }        
        else{
            res.render("signin",{data:{error:"Username not exist"}});
        }
    }
});

router.get("/post/new",function(req,res){
    if(req.session.user){
    res.render("admin/post/new",{data:{error:false}});
    }
    else{
        res.redirect("/admin/signin");
    }
});

router.post("/post/new",function(req,res){
    var params = req.body;

    if(params.title.trim().length == 0){
        var error = "Please input title";
        res.render("admin/post/new",{data:{error}});
    }
    else{
    var now = new Date();
    params.created_at = now;
    params.updated_at = now;

    var post = post_mdl.Add_post(params);

    post.then(function(result){
        res.redirect("/admin");
    }).catch(function(err){
        var error = {
            data: "Error"
        };
        res.render("admin/post/new",{data:error});
    });
    }
});

router.get("/post/edit/:id",function(req,res){
    if(req.session.user){
    var param = req.params;
    var id = param.id;

    var dataa = post_mdl.getPostById(id);

    if(dataa){
        dataa.then(function(result){
            var post = result[0];

            // var data = {
            //     post: posts,
            //     error: false
            // };
            res.render("admin/post/edit",{data:{post}});
        }).catch(function(err){
            var data = {
                error: true,
                message: "Could not insert"
            };

            res.render("admin/post/edit",{data});
        });
    }
    else{
        var data = {
            error: "Could not get By ID"
        };

        res.render("admin/post/edit",{data});
    }
}
else{
    res.redirect("/admin/signin");
}
});

router.put("/post/edit",function(req,res){
    var params = req.body;

    var data = post_mdl.updatePost(params);
    if(!data){
        res.json({status_code : 500});
    }
    else{
        data.then(function(result){
            res.json({status_code: 200});
        }).catch(function(err){
            res.json({status_code: 500});
        });
    }

});


router.delete("/post/delete",function(req,res){
    var post_id = req.body.id;

    var data = post_mdl.deletePost(post_id);

    if(!data){
        res.json({status_code: 500});
    }
    else{
        data.then(function(result){
            res.json({status_code: 200});
        }).catch(function(err){
            res.json({status_code: 500});
        });
    }
});

router.get("/post",function(req,res){
    if(req.session.user){
    res.redirect("/admin");
    }
    else{
        res.redirect("/admin/signin");
    }
});

router.get("/user",function(req,res){
    if(req.session.user){
    var user = user_mdl.getAllUser();

    user.then(function(result){
        var data = {
            users: result,
            error: false
        }
        
        res.render("admin/user",{user:data});
    }).catch(function(err){
        var data = {
            error: "Could not get user info"
        }

        res.render("admin/use",{user:data})
    });
}
    else{
        res.redirect("/admin/signin");
    }
});
module.exports = router;