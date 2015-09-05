window.fbAsyncInit = function() {
    FB.init({
        appId      : '1480642292229101',
        status: true,
        cookie     : true,
        xfbml      : true,
        version    : 'v2.4'
    });
};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/cs_CZ/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));

$(document).on('click', '#fb-login', function (event) {
    FB.login(function(response) {
        if (response.authResponse) {
            FB.api('/me', {fields: 'id, name, email'}, function(response) {
                FbLogin(response.id, response.name, response.email);
            });
        } else {
            console.log('Authorization failed.');
        }
    }, {scope: 'email'});
});

function FbLogin(id, name, email) {
    $.nette.ajax({
        type: 'GET',
        url: fbLink,
        data: {
            fbId: id,
            name: name,
            email: email
        }
    }).done(function (payload) {
        swal({
            title: "Přihlášen!",
            text: "Přihlášení proběhlo úspěšně.",
            timer: 2000,
            showConfirmButton: true,
            type: "success"
        });
    });
}