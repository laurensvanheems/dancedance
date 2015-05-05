var server = io.connect(),
    player,
    lastEmit = $.now();

function init() {
  server.on('connect', menuUI);
  server.on('private game', onCreatePrivateGame);
  server.on('end private game', onEndPrivateGame);
  server.on('idle private game', onIdlePrivateGame);
  server.on('add move', onNewMove);
}

function menuUI() {
  console.log('Server connected');

  $('.js-player-form').on('submit', function(e){
    e.preventDefault();

    var gameCode = $('.js-player-form__gamecode').val(),
        name = $('.js-player-form__input').val();

    if(gameCode == '' || name == '') {
      alert('Fill in all fields');
      return;
    }

    server.emit('join', name, gameCode);
  });

}

function bindGameEvents() {

  $(document).on('keydown', function(e){
    if(player) {
      server.emit('add move', player, e.keyCode, 'key');
    }
  });

  window.ondevicemotion = function(event) {
    if($.now() - lastEmit > 5){
      var accelX = event.accelerationIncludingGravity.x;
      $('.js-game-x').text(Math.round(accelX));
      server.emit('add move', player, accelX, 'movement');
      lastEmit = $.now();
    }
  }




  // // Position Variables
  // var x = 0;
  // var y = 0;

  // // Speed - Velocity
  // var vx = 0;
  // var vy = 0;

  // // Acceleration
  // var ax = 0;
  // var ay = 0;

  // var delay = 10;
  // var vMultiplier = 0.01;

  // window.onload = function() {
  //   if (window.DeviceMotionEvent==undefined) {
  //     document.getElementById("no").style.display="block";
  //     document.getElementById("yes").style.display="none";

  //   } else {
  //     window.ondevicemotion = function(event) {

  //       ax = event.accelerationIncludingGravity.x;
  //       ay = event.accelerationIncludingGravity.y;
  //     }

  //     setInterval(function() {
  //       vy = vy + -(ay);
  //       vx = vx + ax;

  //       var ball = document.getElementById("ball");
  //       y = parseInt(y + vy * vMultiplier);
  //       x = parseInt(x + vx * vMultiplier);

  //       if (x<0) { x = 0; vx = 0; }
  //       if (y<0) { y = 0; vy = 0; }
  //       if (x>document.documentElement.clientWidth-20) { x = document.documentElement.clientWidth-20; vx = 0; }
  //       if (y>document.documentElement.clientHeight-20) { y = document.documentElement.clientHeight-20; vy = 0; }

  //       ball.style.top = y + "px";
  //       ball.style.left = x + "px";
  //       document.getElementById("pos").innerHTML = "x=" + x + "<br />y=" + y;
  //     }, delay);
  //   }
  // };


}

function onCreatePrivateGame(room, playerData) {

  if(!player) {
    player = playerData;
  }

  $('.js-game-code').text(room.roomCode);
  $('.view').removeClass('active');
  $('.view[data-view="game"]').addClass('active');
  bindGameEvents();

}

function onEndPrivateGame() {
  $('.view').removeClass('active');
  $('.view[data-view="start"]').addClass('active');
  $('input').val('');
}

function onIdlePrivateGame() {
  $('.view').removeClass('active');
  $('.view[data-view="wait"]').addClass('active');
}

function onNewMove(data) {

  var key;
  switch (data.key) {
    case 37:
      key = 'left';
      break;
    case 39:
      key = 'right';
      break;
    default:
      return;
  };

  onPlayerMove(key);
}

function onPlayerMove(key) {
  $('[data-view="game"]').prepend(key + '<br/>');
}

$(function(){
  init();
});

