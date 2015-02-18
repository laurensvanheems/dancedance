var server = io.connect('http://localhost:8080');

server.on('connect', function(data){

  nickname = prompt('Nickname');
  server.emit('join', nickname);

  $('.form').on('submit', function(e){
    e.preventDefault();
    server.emit('messages', $('.input').val());
    $('.input').val('');
  });

  server.on('messages', function(data){

    $('.messages').append(data + '<br/>');

  });

});
