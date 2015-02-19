$(function(){

  var server = io.connect();

  var gameStarted = false,
      amountPlayers = 0;

  server.on('connect', function(data){

    $('.name').on('submit', function(e){
      e.preventDefault();
      var name = $('.name__input').val();

      if(name == '') {
        $('.name__input').addClass('error');
        return;
      }

      server.emit('join', name);
      $('.view').removeClass('active');
      $('.view[data-view="game"]').addClass('active');
    });

    server.on('new player', function(data){
      console.log(data);
      amountPlayers++;
      if(amountPlayers === 2) {
        gameStarted = true;
      }
    });

    server.on('add move', function(data){
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
      };
      $('.objects').append(key + '<br/>');
    });

  });

  $('.name__input').on('keydown', function(){
    $(this).removeClass('error');
  });

  $(document).on('keydown', function(e){
    if (gameStarted === true) {
      server.emit('add move', e.keyCode);
    }
  });

});

