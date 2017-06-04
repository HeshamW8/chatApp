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
    } else {
        if (data.error) {
            $('#error - block').style("display:block;").text(error);
        }
    }
}

$('#login-form').submit(function (e) {
    e.preventDefault();
    let email = $('#signinEmail').val();
    let pass = $('#signinPassword').val();

    if (!validate(email)) {
        console.log(email + 'not valid');
        $("#resultLogin").text(email + " is not a valid email");
        $("#resultLogin").css("color", "red");
        $("#resultLogin").css("display", "block");
    } else {
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
    }

});

$('#signup-form').submit(function (e) {
    e.preventDefault();
    let email = $('#signupEmail').val();
    let pass = $('#signupPassword').val();
    let fullname = $('#signupFullName').val();

    if (!validate(email)) {
        console.log(email + 'not valid');
        $("#resultSignup").text(email + " is not a valid email");
        $("#resultSignup").css("color", "red");
        $("#resultSignup").css("display", "block");
    } else {
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
    }


});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validate(email) {
    console.log('validate');
    $(".result").text("");
    if (validateEmail(email)) {
        return true;
    } else {
        return false;
    }
}