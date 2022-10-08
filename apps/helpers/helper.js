// hash password
var bcrypt = require("bcrypt");
var config = require("config");

function hash_pass(password){
    var saltRound = config.get("salt");

    var Salt = bcrypt.genSaltSync(saltRound);
    var hash = bcrypt.hashSync(password,Salt);

    return hash;
}

function compare_pass(pass,hash){
    return bcrypt.compareSync(pass,hash);
}

module.exports = {
    hash_password: hash_pass,
    compare_pass: compare_pass
}

