
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
    "627941914810-5v7t1mt79fg3nueva7vt2rdumaf5pdi0.apps.googleusercontent.com",
    "oKB7WSeThz6i3TFYxFqLmac6",
    "http://localhost:3000/oauthcallback/"
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
    'https://www.googleapis.com/auth/plus.me'
];

var url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: scopes

    // Optional property that passes state parameters to redirect URI
    // state: 'foo'
});

console.log(url);

var code ="4/_gDiM07PaLOW6YRKCPo0IbS--inqflPUKwfUkV1l2E4"

oauth2Client.getToken(code, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (!err) {

        console.log(tokens);

        oauth2Client.setCredentials(tokens);
    }
});


// // set auth as a global default
// google.options({
//     auth: oauth2Client
// });
// var plus = google.plus('v1');



