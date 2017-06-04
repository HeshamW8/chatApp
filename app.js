var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var fs = require('fs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var server = http.createServer(app);
var io = require('socket.io')(server);

mongoose.connect('mongodb://localhost/chatApp', function (err) {
    if (err) {
        console.log("connection to database failed");
    }
});

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(expressSession({
    secret: 'somesecrettokenhere',
    resave: false,
    saveUninitialized: true
}));

fs.readdirSync('./controllers').forEach(function (file) {
    if (file.substr(-3) == '.js') {
        route = require('./controllers/' + file);
        route.controller(app, io);
    }
});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});