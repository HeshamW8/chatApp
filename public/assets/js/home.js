function signup() {
    $('#login-div').css('display', 'none');
    $('#signup-div').css('display', 'block');
}

function login() {
    $('#login-div').css('display', 'block');
    $('#signup-div').css('display', 'none');
}

function redirect(data) {
    if (typeof data.redirect == 'string') {
        window.location = data.redirect
        console.log("hello there");
    }
    console.log(data.redirect);
}

$('#login-form').submit(function (e) {
    e.preventDefault();
    let email = $('#signinEmail').val();
    let pass = $('#signinPassword').val();
    let req = {
        url: '/signin',
        type: 'POST',
        data: {
            email: email,
            password: pass
        },
        success: function (response) {
            console.log(response);
            redirect(response);
        }
    };
    $.ajax(req);
});

$('#signup-form').submit(function (e) {
    console.log('hello');
    e.preventDefault();
    let email = $('#signupEmail').val();
    let pass = $('#signupPassword').val();
    let fullname = $('#signupFullName').val();

    console.log(fullname);

    let req = {
        url: '/signup',
        type: 'POST',
        data: {
            email: email,
            password: pass,
            fullname: fullname
        },
        success: function (response) {
            console.log(response);
            redirect(response);
        }
    };
    $.ajax(req);
});