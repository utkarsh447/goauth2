var express = require("express");
var http = require("http");

const gitClientId = "4492fea22e29c9d55a18";
const gitClientSecret = "ecdec4e970e68c2c4461b664bd5c3b3f3e192251";
const gitRedirectionURL = "http://localhost:3002/callbackg";

var app = express();
var ClientOAuth2 = require('client-oauth2');

var githubAuth = new ClientOAuth2({
    clientId: gitClientId,
    clientSecret: gitClientSecret,
    accessTokenUri: 'https://github.com/login/oauth/access_token',
    authorizationUri: 'https://github.com/login/oauth/authorize',
    redirectUri: gitRedirectionURL,
    scopes: ['']
});

app.get('/callbackg', function (req, res) {
    var code = req.query.code;
    console.log("Git Code: " + code);
    console.log("request: ");
    console.log(req.originalUrl);
/*
    var token = githubAuth.createToken('access token', 'optional refresh token', 'optional token type', { data: 'raw user data' });

// Set the token TTL.
    token.expiresIn(1234); // Seconds.
    token.expiresIn(new Date('2018-1-12'));
    //token.refresh().then(storeNewToken);
    token.sign({
        method: 'get',
        url: 'https://api.github.com/users'
    });
*/

    githubAuth.code.getToken(req.originalUrl)
        .then(function (user) {
            console.log("User\n: ");
            console.log(user);
            console.log("1. access token: ")
            console.log(user.ClientOAuth2Token.data.accessToken);
            console.log("2. access token: ")
            console.log(user.ClientOAuth2Token.data.accessToken);
        })
});

app.get('/', function (req, res) {
    var uri = githubAuth.code.getUri();
    console.log(uri);
    res.redirect(uri);
});


app.listen(3002, function () {
    console.log("Listening");
});