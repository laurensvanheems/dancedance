var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/src'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/src/views/index.html');
});

io.on('connection', function(client){

  client.on('join', function(name){
    client.nickname = name;
    client.emit('new player', name);
    client.broadcast.emit('new player', name);
  });

  client.on('add move', function(data){
    var move = {name: client.nickname, key: data};
    client.broadcast.emit('add move', move);
    client.emit('add move', move);
  });

  client.on('user disconnect', function(){
    client.broadcast.emit('user disconnect');
    client.emit('user disconnect');
  });

});

server.listen(8080);