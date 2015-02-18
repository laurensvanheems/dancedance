var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var Message;

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

  var messageSchema = mongoose.Schema({
    name: String,
    data: String
  });

  Message = mongoose.model('Message', messageSchema);

});

app.use(express.static(__dirname + '/src'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/src/views/index.html');
});

var messages = [];

var storeMessages = function(name, data){
  var message = new Message({ name: name, data: data });
  message.save(function (err, message) {
    if (err) return console.error(err);
  });
}

io.on('connection', function(client){

  client.on('join', function(name){
    Message.find(function (err, messages) {
      if (err) return console.error(err);
      messages.forEach(function(message){
        client.emit('messages', message.name + ': ' + message.data);
      });
    });

    client.nickname = name;
    client.broadcast.emit('messages', name + ' just joined');
  });

  client.on('messages', function(data){

    var nickname = client.nickname;
    client.broadcast.emit('messages', nickname + ': ' + data);
    client.emit('messages', nickname + ': ' + data);
    storeMessages(nickname, data);
  });

});

server.listen(8080);