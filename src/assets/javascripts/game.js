paper.install(window);

var server = io.connect(),
    canvas = $('#game'),
    gameData = {
      points: 2,
      length: 15,
      degrees: -90,
      lastKey: 0,
      position: {
        x: canvas.width() / 2,
        y: canvas.height() / 2
      },
      alterPosition: {
        x: 0,
        y: (Math.PI * -1)
      }
    };

function init() {
  server.on('connect', createGame);
  server.on('private game', onCreatePrivateGame);
  server.on('end private game', onEndPrivateGame);
  server.on('add move', onNewMove);
}

function createGame() {
  server.emit('create room');
}

function onCreatePrivateGame(room, playerData) {

  console.log(room);

  if(playerData) {
    $('.js-name').text(playerData.name);
    initCanvas();
  }

  $('.js-game-code').text(room.roomCode);

}

function onEndPrivateGame() {
  console.log('game ended');
}

function onNewMove(data) {
  if(data.type == 'key') {
    switch (data.key) {
      case 37:
        // left
        gameData.degrees -= 45;
        break;
      case 39:
        // right
        gameData.degrees += 45;
        break;
      default:
        return;
    };
  } else {
    if(data.key > 2.5) {
      gameData.degrees += 10;
    } else if (data.key < -2.5) {
      gameData.degrees -= 10;
    } else {
      gameData.degrees -= 0;
    }
  }

  console.log(gameData.degrees);

  var rad = gameData.degrees * (Math.PI / 180);
  gameData.alterPosition.x = Math.cos(rad) * 5;
  gameData.alterPosition.y = Math.sin(rad) * 5;
}

function initCanvas() {

  paper.setup(canvas[0]);

  var tool = new Tool(),
      myPath = createWorm();

  paper.view.attach('frame', moveWorm);

  function moveWorm() {
    gameData.position.x += gameData.alterPosition.x;
    gameData.position.y += gameData.alterPosition.y;

    if(gameData.position.x <= 0 || gameData.position.y <= 0 || gameData.position.x >= canvas.width() || gameData.position.y >= canvas.height()) {
      console.log('end');
      paper.view.detach('frame', moveWorm);
    }


    myPath.firstSegment.point = gameData.position;
    for (var i = 0; i < gameData.points - 1; i++) {
      var segment = myPath.segments[i];
      var nextSegment = segment.next;
      var vector = new paper.Point(segment.point.x - nextSegment.point.x,segment.point.y - nextSegment.point.y);
      vector.length = gameData.length;
      nextSegment.point = new paper.Point(segment.point.x - vector.x,segment.point.y - vector.y);
    }
    myPath.smooth();
  }

  paper.view.draw();
}

function createWorm(){
    var path = new paper.Path({
      strokeColor: '#ffffff',
      strokeWidth: 14,
      strokeCap: 'round'
    });

    var start = new paper.Point(Math.random()*100,Math.random()*100);
    for (var i = 0; i < gameData.points; i++) {
      path.add(new paper.Point(i * gameData.length + start.x, 0 + start.y));
    }

    return path;
  }

$(function(){
  init();
});




  // paper.tool.onMouseMove = function(event) {

  //   myPath.firstSegment.point = event.point;
  //   for (var i = 0; i < gameData.points - 1; i++) {
  //     var segment = myPath.segments[i];
  //     var nextSegment = segment.next;
  //     var vector = new paper.Point(segment.point.x - nextSegment.point.x,segment.point.y - nextSegment.point.y);
  //     vector.length = gameData.length;
  //     nextSegment.point = new paper.Point(segment.point.x - vector.x,segment.point.y - vector.y);
  //   }
  //   myPath.smooth();

  //   // if($.now() - lastEmit > 5){
  //   //   socket.emit('mousemove',{
  //   //     'color' : '#ffffff',
  //   //     'path'  : myPath,
  //   //     'id': id
  //   //   });
  //   //   lastEmit = $.now();
  //   // }
  // }