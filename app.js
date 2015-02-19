/* Node requirements */

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


/* Game Vars */

var players = [];


/* Game Initialisation */

function init() {

  app.use(express.static(__dirname + '/src'));

  app.get('/', function(req, res){
    res.sendFile(__dirname + '/src/views/index.html');
  });

  server.listen(8080);

  setEventHandlers();

}

/* Game events */

function setEventHandlers() {
  io.on('connection', onSocketConnection);
}

function onSocketConnection(client) {

  client.on('join', onPlayerJoin);

  client.on('add move', onPlayerMove);

  client.on('disconnect', onPlayerDisconnect);

}

function onPlayerJoin(name) {
  var newPlayer = {id: this.id, name: name, role: 0},
      readyToStart = false;

  if(players.length === 1) {
    newPlayer.role = 1;
  }

  players.push(newPlayer);
  if(players.length === 2) {
    readyToStart = true;
  }

  this.emit('player', newPlayer, readyToStart);
  this.broadcast.emit('new player', readyToStart);
}

function onPlayerMove(data) {
  if(players.length !== 2) {
    return;
  }

  var move = {id: this.id, key: data, role: playerById(this.id).role};

  this.emit('add move', move);
  this.broadcast.emit('add move', move);

}

function onPlayerDisconnect() {
  console.log('lost connection');

  var removePlayer = playerById(this.id);

  // Player not found
  if (!removePlayer) {
    console.log("Player not found: "+this.id);
    return;
  };

  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1);

  // Broadcast removed player to connected socket clients
  if(players.length !== 2) {
    this.broadcast.emit('end game');
  }

}


/* Helper functions */

function playerById(id) {
  var i;
  for (i = 0; i < players.length; i++) {
    if (players[i].id == id)
      return players[i];
  };

  return false;
};

/* Start Game */
init();