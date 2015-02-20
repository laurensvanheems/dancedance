function Room(id, owner) {
  this.id = id;
  this.owner = owner;
  this.players = [];
  this.playerLimit = 2;
  this.status = "available";
  this.private = false;
};

Room.prototype.addPlayer = function(player) {
  if (this.status === "available") {
    this.people.push(player);
  }
};

Room.prototype.removePlayer = function(player) {
  var playerIndex = -1;
  for(var i = 0; i < this.players.length; i++){
    if(this.players[i].id === player.id){
      playerIndex = i;
      break;
    }
  }
  this.players.remove(playerIndex);
};

Room.prototype.getPlayer = function(playerID) {
  var player = null;
  for(var i = 0; i < this.players.length; i++) {
    if(this.players[i].id == playerID) {
      player = this.players[i];
      break;
    }
  }
  return player;
};

Room.prototype.isAvailable = function() {
  if (this.status === "available") {
    return true;
  } else {
    return false;
  }
};

Room.prototype.isPrivate = function() {
  if (this.private) {
    return true;
  } else {
    return false;
  }
};

module.exports = Room;