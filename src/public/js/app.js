const ws = new WebSocket('ws://localhost:8081/1');

ws.onmessage = (message) => {
    console.log(message);
    $('.chat-box').append('<p>'+ message.data +'</p>');
}

$('#send-message').click(function (e) {
   e.preventDefault();
    ws.send(JSON.stringify({
        room: $('#rooms-list option:selected').data('id'),
        message: $('#message-box').val()
    })); 
});

$('.join-room').click(function (e) {
    e.preventDefault();
    ws.send(JSON.stringify({
        room: $('#rooms-list option:selected').data('id'),
        name: $('#users-list option:selected').data('id')
    }));
});