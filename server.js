var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var extend = require('util')._extend;
var ALL_CHARACTERS = require('./all-characters').ALL;
const SELECT = require('./all-characters').SELECT;

var players = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
var port = process.env.PORT || 5000;
http.listen(port, function() {
    console.log('listening on *:'+port);
});

io.on('connection', function(socket) {
    console.log('usuario conectado');
    socket.on('all-characters', function(message) {
        socket.emit('all-characters', ALL_CHARACTERS);
    });

    socket.on('insert-player', function(message) {
        players.push(message);
        insertPlayer();
        io.emit('insert-player', players);
        socket.broadcast.emit('all-characters', ALL_CHARACTERS);
    });

    socket.on('all-players', function(message) {
        if (message) {
            players = message;
        }
        io.emit('insert-player', players);
    });

    socket.on('update-players', function(message) {
        io.emit('insert-player', players);
    });

    socket.on('init-challenge', function(message) {
        socket.broadcast.emit('init-challenge', message);
    });

    socket.on('next-player', function(message) {
        socket.broadcast.emit('next-player', message);
    });

    socket.on('game', function(message) {
        socket.broadcast.emit('game', message);
    });

});

function insertPlayer() {
    for (var index = 0; index < players.length; index++) {
        let player = players[index];
        players[index].class = SELECT[1]
        if (index == 0) {
            player.class = SELECT[0];
        }
        var ind = ALL_CHARACTERS.findIndex(character => character.id == player.id);
        if (ind >= 0) {
            ALL_CHARACTERS[ind] = extend({}, player);
            ALL_CHARACTERS[ind].class = SELECT[0];
        }
    }

}