var socket;
var connected = false;

$.getScript("/assets/js/socket.io.js", function () {
    socket = io('http://localhost:3000');

    socket.on('connect', function () {
        connected = true;
        socket.emit('add user', $('#username').text());
    });

    socket.on('disconnect', function () {
        socket.close();
    })

    socket.on('new message', function (data) {
        var messageElement = $('<li class="media"/>')
            .text(data.username + ': ' + data.message);
        var brk = $('<br/>');
        $('#chat-panel').append(messageElement, brk);
    });

    socket.on('usernames list', function (usernames) {
        console.log(usernames);
        $('#online-users').html("");
        usernames.forEach(function (user) {
            var userElement = $('<li class="media"/>')
                .text(user);
            $('#online-users').append(userElement);
        }, this);
    })
});

function cleanInput(input) {
    return $('<div/>').text(input).text();
}

function sendMessage() {

    var message = $('#inputMessage').val();
    var username = $('#username').text();

    console.log(message);
    console.log(connected);

    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
        $('#inputMessage').val('');
        var messageElement = $('<li class="media"/>')
            .text(username + ': ' + message);
        var brk = $('<br/>');
        $('#chat-panel').append(messageElement, brk);
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', message);
    }
}