module.exports = function(io){
    var usernames = [];
    io.sockets.on("connection",function(socket){
        console.log("Have a new user connected");

        //Lang nghe su kien tu` client

        socket.on("adduser",function(username){
            //save tren server
            socket.username = username;
            usernames.push(username);

            //Thong bao cho ban than
            var data = {
                sender:"SERVER",
                message: "YOU HAVE JOIN CHAT ROOM"
            };

            socket.emit("update_message",data);

            //Thong bao cho cac user khac
            var data = {
                sender:"SERVER",
                message: username+  " " + "have join to chat room"
            };

            socket.broadcast.emit("update_message",data);

        }); 

        // Lang nghe su kien send_message

        socket.on("send_message",function(message){
        
                   //Thong bao cho ban than
                   var data = {
                    sender:"YOU",
                    message: message
                };
    
                socket.emit("update_message",data);
    
                //Thong bao cho cac user khac
                var data = {
                    sender:socket.username,
                    message: message
                };
    
                socket.broadcast.emit("update_message",data);
        });

        //su kien thoat

        socket.on("disconnect",function(){
            //xoa user

           // console.log(socket.user);
            for(var i = 0; i < usernames.length; i++){
                if(usernames[i] == socket.username){
                    usernames.splice(i,1);
                }
            }

            var data = {
                sender: "SERVER",
                message: socket.username + " " + "left chat room"
            }

            socket.broadcast.emit("update_message",data);
        });
    });
}