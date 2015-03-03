var server = io.connect(),
    moves = [],
    responseTime = 600,
    range = 50,
    moveTimer = 200,
    moveAvailable = true,
    player;

function init() {
  server.on('connect', menuUI);
  server.on('private game', onCreatePrivateGame);
  server.on('end game', onEndGame);
  server.on('add move', onNewMove);
}

function menuUI() {
  console.log('Server connected');

  $('.js-player-form').on('submit', function(e){
    e.preventDefault();
    onMenuClick('master');
  });

  $('.js-master-game').on('click', function(){
    onMenuClick('master');
  });

  $('.js-create-game').on('click', function(){
    onMenuClick('create-private');
  });

  $('.js-join-game').on('click', function(){
    var gameCode = $('.js-player-form__gamecode').val();

    if(gameCode == '') {
      $('.js-player-form__gamecode').addClass('error');
      alert('Fill in your game code');
      return;
    }

    onMenuClick('join-private', gameCode);
  });

  $('.js-player-form__input').on('keydown', function(){
    $(this).removeClass('error');
  });

}

function bindGameEvents() {
  $(document).on('keydown', function(e){
    if(player) {
      if(player.role === 0 && moveAvailable === true || player.role === 1) {
        server.emit('add move', player, e.keyCode);
        moveAvailable = false;
        setTimeout(function(){
          moveAvailable = true;
        }, moveTimer);
      }
    }
  });
}

function onMenuClick(gametype, gameCode) {
  var name = $('.js-player-form__input').val();

  if(name == '') {
    $('.js-player-form__input').addClass('error');
    alert('Fill in your name first');
    return;
  }

  server.emit('join', name, gametype, gameCode);
  $('.view').removeClass('active');
  $('.view[data-view="wait"]').addClass('active');
}

function onCreatePrivateGame(playerData, room) {
  console.log(playerData);
  console.log(room);

  if(!player) {
    player = playerData;
  }

  $('.js-game-code').text(room.roomCode);

  if(room.players.length >= room.minPlayers) {
    $('.view').removeClass('active');
    $('.view[data-view="game"]').addClass('active');
    bindGameEvents();
  }

}

function onPlayer(data, start) {
  player = data;
  console.log(player);
  alert('player');

  $('.view').removeClass('active');
  if(start === true) {
    $('.view[data-view="game"]').addClass('active');
  } else {
    $('.view[data-view="wait"]').addClass('active');
  }
}

function onNewPlayer(start) {
  alert('new player');
  if(player) {
    $('.view').removeClass('active');
    if(start === true) {
      $('.view[data-view="game"]').addClass('active');
    } else {
      $('.view[data-view="wait"]').addClass('active');
    }
  }
}

function onStartGame(data) {
  $('.view').removeClass('active');
  $('.view[data-view="game"]').addClass('active');
}

function onEndGame(data) {
  if(!$('.view[data-view="start"]').hasClass('active')) {
    $('.view').removeClass('active');
    $('.view[data-view="wait"]').addClass('active');
  }
}

function onNewMove(data) {

  console.log(data);
  var key;
  switch (data.key) {
    // Controls
    case 37: // Left
      key = 'left';
      break;
    case 38: // Up
      key = 'up';
      break;
    case 39: // Right
      key = 'right';
      break;
    case 40: // Down
      key = 'down';
      break;
    default:
      return;
  };

  if(data.role === 0) {
    onLeaderMove(key);
  } else {
    onFollowerMove(key);
  }
}

function onLeaderMove(key) {
  var moveTime = Date.now() + responseTime,
      moveObject,
      moveHtml = '<figure class="game__objective game__objective--'+key+'" data-time="'+moveTime+'">' +
                 '<i class="game__objective__arrow fa fa-angle-'+key+'"></i></figure>';

  moves.push({time: moveTime, key: key});

  moveObject = $(moveHtml);
  $('.objectives').append(moveObject);

  setTimeout(function(){
    moves.splice(0, 1);
    if(!moveObject.hasClass('correct')) {
      moveObject.addClass('incorrect');
    }
  }, (responseTime + moveTimer));

  setTimeout(function(){
    moveObject.remove();
  },1000);
}

function onFollowerMove(key) {
  $('.game__answers__arrow--' + key).addClass('game__answers__arrow--press');
  setTimeout(function(){
    $('.game__answers__arrow--' + key).removeClass('game__answers__arrow--press');
  },100);

  if(moves.length === 0) return;

  var followerTime = Date.now(),
      moveTime = moves[0].time,
      moveDiff = Math.abs(followerTime - moveTime);

  if(moveDiff < range && key == moves[0].key) {
    $('.game__objective[data-time="'+moveTime+'"]').addClass('correct');
  } else {
    $('.game__objective[data-time="'+moveTime+'"]').addClass('incorrect');
  }

}

$(function(){
  init();
});

