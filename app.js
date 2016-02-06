var app = require('express')();
var express = require("express");
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var users = [];

function user(socket,name) {
  this.id = socket.id
  this.socket = socket;
  this.name = name;
}

function removeUser(id) {
  var name;
  for(var i = 0; i < users.length; ++i) {
    if(users[i].id == id) {
      name = users[i].name;
      users.splice(i,1);
    }
  }
  return name;
}

function getName(id) {
  for(var i = 0; i < users.length; ++i) {
    if(users[i].id == id) {
      return users[i].name;
    }
  }
}

function getJsonUsers() {
  var usernames = [];
  for (var i = 0; i < users.length; i++) {
    usernames.push(users[i].name);
  }
  return JSON.stringify(usernames);
}

function displayUsers() {
  console.log("Online: " +users.length);
  for(var i = 0; i < users.length; ++i) {
    console.log(users[i].id + "    : " + users[i].name);
  }
}







app.use(express.static('./public/'));


io.on('connection', function(socket){
  console.log("A client connected: " + socket.id);
  displayUsers();
  socket.on("regReq",function(name){
      var newUser = new user(socket,name);
      var actualUsers = getJsonUsers();
      users.push(newUser);
      socket.emit("regAck",actualUsers);
      socket.broadcast.emit("newUser",name);
  });


  socket.on("disconnect",function(){
    var userLeave = removeUser(socket.id);
    console.log("A client leave: " + socket.id);
    displayUsers();
    if(userLeave)
      socket.broadcast.emit("userLeave",userLeave);
  })

  socket.on("message",function(msg){
    console.log("Received: " +msg);
    socket.broadcast.emit("message",{"from":getName(socket.id), "text":msg});
  });



});

http.listen(80, function(){
  console.log('listening on *:80');
});
