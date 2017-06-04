var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    fullname: String,
    email: String,
    password: String,
    online: Boolean
});

User = mongoose.model('user', userSchema);

var threadSchema = new Schema({
    userOneID: String,
    userTwoID: String,
    threadBody: String
});
Thread = mongoose.model('thread', threadSchema);

var getOnlineUsers = function () {
    return {};
};

var getOldMessages = function (id) {
    Thread.find({ userOneID: id }, function (err, thread) {
        console.log(thread);
    })
}

var registerUser = function (fullname, email, password, callback) {
    var new_user = new User({
        'fullname': fullname,
        'email': email,
        'password': password,
        'online': true
    });
    User.findOne({ email: email }, function (err, user) {
        if (user) {
            callback(false, null, null, 'email already exists', null, null);
        }
        else {
            new_user.save(function (err) {
                if (err)
                    callback(false, new_user.id, new_user.fullname, 'try again later', null, null);
                else
                    callback(true, new_user.id, new_user.fullname, null, getOnlineUsers(), getOldMessages(new_user.id));
            });
        }
    });
};

var signin = function (email, password, callback) {
    User.findOne({ 'email': email, 'password': password }, 'fullname', function (err, user) {
        if (user) {
            console.log('user found');
            User.findByIdAndUpdate(user.id, { online: true }, function (err, user_found) {
                if (user_found) {
                    console.log('username :: ' + user.fullname);
                    callback(true, user.id, user.fullname, null, getOnlineUsers(), getOldMessages(user.id));
                }
            });
        }
        else {
            console.log('false signin');
            callback(false, null, null, 'wrong commbination');
        }
    })
}

var signout = function (userID) {
    User.findByIdAndUpdate(userID, { online: false }, function (err, user) {
        if (user) {
            callback(true, user.id, null);
        } else {

        }
    });
}

module.exports = {
    registerUser: registerUser,
    signin: signin,
    signout: signout
};