var mongoose = require('mongoose')
var model = require('../models/user');
module.exports.controller = function (app, io) {

    var sockets = [];
    var usernames = [];

    io.on('connection', function (socket) {
        console.log('client connected');

        socket.on('new message', function (data) {
            // we tell the client to execute 'new message'
            console.log('received');
            socket.broadcast.emit('new message', {
                username: socket.username,
                message: data
            });
        });

        sockets.push(socket);

        socket.on('disconnect', function () {
            sockets.splice(sockets.indexOf(socket), 1);
        });

        socket.on('add user', function (username) {
            socket.username = username;
            usernames.push(username)
            sockets.forEach(function (socket) {
                socket.emit('usernames list', usernames);
            });
            console.log(usernames);
        })

    })


    app.post('/signup', function (req, res) {

        if (req.session.userID) {
            res.send({ redirect: 'chat' });
        } else {
            var fullname = req.body.fullname;
            var email = req.body.email;
            var password = req.body.password;

            model.registerUser(fullname, email, password, function (success, userID, fullname, error, onlineUsers, threads) {
                console.log('res : ' + success);
                if (success) {
                    req.session.userID = userID;
                    req.session.fullname = fullname;
                    req.session.onlineUsers = onlineUsers;
                    req.session.threads = threads;
                    res.send({ redirect: 'chat' });
                } else {
                    res.send({ error: error });
                }
            });
        }
    });

    app.post('/signin', function (req, res) {

        if (req.session.userID) {
            res.send({ redirect: 'chat' });
        } else {
            var email = req.body.email;
            var password = req.body.password;
            model.signin(email, password, function (success, userID, fullname, err, onlineUsers, threads) {
                if (success) {
                    req.session.userID = userID;
                    req.session.fullname = fullname;
                    req.session.onlineUsers = onlineUsers;
                    req.session.threads = threads;
                    res.send({ redirect: 'chat' });
                } else {
                    res.send({ error: err });
                }
            });
        }
    });

    app.get('/chat', function (req, res) {
        if (req.session.userID) {
            res.render('chat', {
                id: req.session.userID,
                fullname: req.session.fullname,
                onlineUsers: req.session.onlineUsers,
                threads: req.session.threads
            });
        }
        else {
            res.redirect('/');
        }
    });
}