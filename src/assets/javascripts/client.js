var server = io.connect(),
    moves = [],
    responseTime = 1000,
    range = 200,
    player;

function init() {
  server.on('connect', onSocketConnect);
  server.on('player', onPlayer);
  server.on('new player', onNewPlayer);
  server.on('start game', onStartGame);
  server.on('end game', onEndGame);
  server.on('add move', onNewMove);
}

function onSocketConnect() {
  console.log('Server connected');

  $('.name').on('submit', function(e){
    e.preventDefault();
    var name = $('.name__input').val();

    if(name == '') {
      $('.name__input').addClass('error');
      return;
    }

    server.emit('join', name);
    $('.view').removeClass('active');
    $('.view[data-view="wait"]').addClass('active');
  });

  $('.name__input').on('keydown', function(){
    $(this).removeClass('error');
  });

  $(document).on('keydown', function(e){
    server.emit('add move', e.keyCode);
  });

}

function onPlayer(data, start) {
  player = data;
  console.log(player);

  $('.view').removeClass('active');
  if(start === true) {
    $('.view[data-view="game"]').addClass('active');
  } else {
    $('.view[data-view="wait"]').addClass('active');
  }
}

function onNewPlayer(start) {
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
      moveHtml = $('<figure class="key" data-time="'+moveTime+'">'+key+'</figure>');

  console.log(moveTime);
  moves.push({time: moveTime, key: key});

  $('.objects').append(moveHtml);

  setTimeout(function(){
    moveHtml.remove();
    console.log(moves[0]);
    moves.splice(0, 1);
  },2000);
}

function onFollowerMove(key) {
  var followerTime = Date.now(),
      moveTime = moves[0].time,
      moveDiff = Math.abs(followerTime - moveTime);

  console.log(moveDiff);

  if(moveDiff < range && key == moves[0].key) {
    $('.key[data-time="'+moveTime+'"]').addClass('green');
  }

}

$(function(){
  init();
});

