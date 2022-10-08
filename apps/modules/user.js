var db = require("../common/database");
var q = require("q");

var conn = db.getconnection();

function addUser(user){
    if(user){
        var defer = q.defer();
        var query = conn.query('INSERT INTO users SET ?',user,function(err,result){
            if(!err){
                defer.resolve(result);
            }
            else{
                defer.reject(err);
            }
        });
        return defer.promise;
    }
    return false;
}

function getUserByEmail(email){
    if(email){
        var defer = q.defer();
        var query = conn.query('SELECT * FROM users WHERE ?',{email: email},function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }

        });
        return defer.promise;
    }
    else{
    return false;
    }
}

function getAllUser(){
    var defer = q.defer();
    var query = conn.query('SELECT * FROM users',function(err,result){
        if(err){
            defer.reject(err);
        }
        else{
            defer.resolve(result);
        }

    });
    return defer.promise;
}

module.exports = {
    addUser: addUser,
    getUserByEmail: getUserByEmail,
    getAllUser: getAllUser
};
