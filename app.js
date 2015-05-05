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

  app.get('/controls', function(req, res){
    res.sendFile(__dirname + '/src/views/controls.html');
  });

  server.listen(8080);

  setEventHandlers();
}


/* Game events */

function setEventHandlers() {
  io.on('connection', onSocketConnection);
}

function onSocketConnection(client) {
  // Events from game
  client.on('create room', createRoom);

  // Events from controls
  client.on('join', onPlayerJoin);
  client.on('add move', onPlayerMove);
  client.on('disconnect', onPlayerDisconnect);
}

function createRoom() {

  var room,
      id = uuid.v4(),
      roomCode = createRoomCode();

  room = new Room(id, roomCode);
  rooms[id] = room;

  this.join(id);
  this.emit('private game', rooms[id]);

}

function onPlayerJoin(name, roomCode) {

  players[this.id] = {
    id: this.id,
    name: name,
    roomId: null,
    role: 0
  }

  joinPrivateRoom(this, players[this.id], roomCode);
}

function onPlayerMove(player, keycode, type) {
  var move = {id: player.id, key: keycode, role: player.role, type: type};

  this.emit('add move', move);
  this.to(player.roomId).broadcast.emit('add move', move);
}

function onPlayerDisconnect() {
  // TODO


  if(_.size(players) == 0 || typeof players[this.id] == 'undefined' || players[this.id].roomId == null) {
    return;
  }

  var player = players[this.id],
      room = rooms[player.roomId];

  // Player not found
  if (!player) {
    console.log("Player not found: "+this.id);
    return;
  };

  if(room.owner == player.id) {
    this.to(player.roomId).broadcast.emit('end private game');

    for (var i = 0; i < room.players.length; i++) {
      players[room.players[i]].roomId = null;
    }

    delete rooms[player.roomId];

  } else {
    room.players.splice(room.players.indexOf(player.id), 1);

    if(room.players.length < room.minPlayers) {
      this.to(player.roomId).broadcast.emit('idle private game');
    }
  }

  delete players[this.id];
}


/* Room handling */

function joinPrivateRoom(socket, player, roomCode) {

  var roomId = getRoomId(parseInt(roomCode,10));
  players[player.id].roomId = roomId;
  rooms[roomId].players.push(player.id);
  socket.join(roomId);

  socket.emit('private game', rooms[roomId], player);
  socket.to(roomId).broadcast.emit('private game', rooms[roomId], player);
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

/* Start Game */

init();