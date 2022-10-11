var express = require("express");
var config = require("config");
var bodyParser = require("body-parser");
var session = require("express-session");
var socketio = require("socket.io");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('trust proxy',1);
app.use(session({
    secret:config.get("secret_key"),
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false}
}));

var controller = require(__dirname + "/apps/controllers");

app.set("views",__dirname + "/apps/views");
app.set("view engine","ejs");

//cau hinh static folder
app.use("/static",express.static(__dirname + "/public"));

app.use(controller);

var port = config.get("server.port");
var host = config.get("server.host");

var server = app.listen(port,host,function(){
    console.log("Sever is running");
});

var io = socketio(server);

var socketcontrol = require("../Web-Demo/apps/common/socketcontrol")(io);