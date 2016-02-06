$("#notify").hide();
$("#messaging").hide();
function notify(message) {
  $('#notify').append($('<li class="list-group-item list-group-item-info">').text(message));
}

function displayUsers() {
  return;
  $("#users").empty();
  for(var i = 0; i < users.length; ++i) {
    var name = users[i];
    $('#users').append($('<li class="list-group-item list-group-item-info">').text(name));
  }
}


var socket = io();
var connected = false;
var users = [];



socket.on("newUser",function(msg){
  if(!connected) return;
  users.push(msg);
  displayUsers()
  console.log("New user!");
  notify("New user connected: " + msg);
});

socket.on("regAck",function(userList){
  $("#events").toggleClass("col-md-8");
  $("#events").addClass("col-md-12");
  $("#notify").show();
  $("#register").hide();
  $("#messaging").show();
  connected = true;
  users = JSON.parse(userList);
  displayUsers()
  notify("You're connected and registered as: " + $("#usernameInput").val());
});

socket.on("userLeave",function(msg) {
  if(!connected) return;
  users.splice( $.inArray(msg, users), 1 );
  displayUsers()
  notify(msg + " leave the chat.");
});

socket.on("message",function(msg) {
  $('#messages').append($('<li class="list-group-item list-group-item-info">').text(msg.from + ": " + msg.text));
})


$("#sendForm").submit(
  function(e){
  e.preventDefault();
  e.stopPropagation();
  $('#messages').append($('<li class="list-group-item list-group-item-danger">').text("You" + ": " + $("#message").val()));
  socket.emit("message",$("#message").val());
  $("#message").val("");
});


$("#regForm").submit(
  function(e) {
    e.preventDefault();
    e.stopPropagation();
    notify("Registration begin...");
    socket.emit("regReq",$("#usernameInput").val());
    return false;
  }
)
