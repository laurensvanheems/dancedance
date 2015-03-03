/* Node requirements */

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var uuid = require('node-uuid');
var _ = require('underscore')._;
var Room = require('./room.js');


/* Game Vars */

var players = {},
    rooms = {};


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

function onPlayerJoin(name, gametype, roomCode) {

  players[this.id] = {
    id: this.id,
    name: name,
    roomId: null,
    role: 0
  }

  switch(gametype) {
    case 'master':
      // Join / create master game
      break;
    case 'join-private':
      joinPrivateRoom(this, players[this.id], roomCode);
      break;
    case 'create-private':
      createPrivateRoom(this, players[this.id]);
      break;
  }
}

function createPrivateRoom(socket, player) {
  var room,
      id = uuid.v4(),
      roomCode = createRoomCode();

  room = new Room(id, player.id, roomCode);
  rooms[id] = room;

  players[player.id].roomId = id;
  socket.join(id);

  socket.emit('private game', player, rooms[id]);
}

function joinPrivateRoom(socket, player, roomCode) {
  var roomId = getRoomId(parseInt(roomCode,10));

  player.role = 1;
  players[player.id].role = 1;
  players[player.id].roomId = roomId;
  rooms[roomId].players.push(player.id);
  socket.join(roomId);

  socket.emit('private game', player, rooms[roomId]);
  socket.to(roomId).broadcast.emit('private game', player, rooms[roomId]);
}

function onPlayerMove(player, keycode) {
  var move = {id: player.id, key: keycode, role: player.role};

  this.emit('add move', move);
  this.to(player.roomId).broadcast.emit('add move', move);

}

function onPlayerDisconnect() {
  console.log('lost connection');
  console.log(players);
  console.log(rooms);
  if(_.size(players) == 0) {
    return;
  }

  var player = players[this.id],
      room = rooms[player.roomId],
      cancelGame = false;

  // Player not found
  if (!player) {
    console.log("Player not found: "+this.id);
    return;
  };

  if(room.owner == player.id) {
    console.log('remove room');
    cancelGame = true;
    //removeRoom();
  }

  room.players.splice(room.players.indexOf(player.id), 1);

  if(room.players.length < room.minPlayers) {
    cancelGame = true;
  }

  // Remove player from players array
  delete players[this.id]

  console.log(players);
  console.log(rooms);

  // Broadcast removed player to connected socket clients
  if(cancelGame === true) {
    console.log('end game');
    this.to(player.roomId).broadcast.emit('end game');
  }

}


/* Helper functions */

function createRoomCode() {
  var roomCode = Math.round(Math.random() * 10000);

  _.find(rooms, function(key, value) {
    if (key.roomCode === roomCode) {
      createRoomCode();
    }
  });

  return roomCode;
}

function getRoomId(roomCode) {
  var roomId = -1;

  _.find(rooms, function(key, value) {
    if (key.roomCode === roomCode) {
      roomId = key.id;
    }
  });

  return roomId;
}

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