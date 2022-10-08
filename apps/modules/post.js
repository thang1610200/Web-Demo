var db = require("../common/database");
var q = require("q");

var conn = db.getconnection();

function getAllPost(){
    var defer = q.defer();
    var query = conn.query('SELECT * FROM posts',function(err,data){
        if(err){
            defer.reject(err);
        }
        else{
            defer.resolve(data);
        }
    });
    return defer.promise;
};

function Add_post(data){
    if(data){
        var defer = q.defer();

        var query = conn.query('Insert into posts SET ?',data,function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function getPostById(id){
    if(id){
        var defer = q.defer();
        var data = conn.query('SELECT * FROM posts WHERE ?',{id : id},function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function updatePost(data){
    if(data){
        var defer = q.defer();

        var query = conn.query('UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?',
        [data.title,data.content, data.author, new Date(), data.id],function(err,result){
            if(err){
                defer.reject(err)
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}


function deletePost(data){
    if(data){
        var defer = q.defer();

        var query = conn.query('DELETE FROM posts WHERE id = ?',
        [data],function(err,result){
            if(err){
                defer.reject(err)
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}
module.exports = {
    getAllPost: getAllPost,
    Add_post: Add_post,
    getPostById: getPostById,
    updatePost: updatePost,
    deletePost: deletePost
};