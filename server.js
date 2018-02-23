var express = require("express");
var http = require("http");
var Session = require("express-session");
var google = require("googleapis");
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
var fs = require('fs');

const ClientId = "627941914810-5v7t1mt79fg3nueva7vt2rdumaf5pdi0.apps.googleusercontent.com";
const ClientSecret = "oKB7WSeThz6i3TFYxFqLmac6";
const RedirectionUrl = "http://localhost:3000/oauthcallback/";

const gitClientId = "4492fea22e29c9d55a18";
const gitClientSecret = "ecdec4e970e68c2c4461b664bd5c3b3f3e192251";
const gitRedirectionURL = "http://localhost:3000/callbackG";

const gitcredentials = {
    client: {
        id: gitClientId,
        secret: gitClientSecret
    },
    auth : {
        tokenHost : 'https://api.oauth.com'
    }
};

const oauth2 = require('simple-oauth2').create(gitcredentials);

const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirecturi : gitRedirectionURL,
    scope: "",
    state: "offline"
});

var app = express();

function getOAuthClient () {
    return new OAuth2(ClientId ,  ClientSecret, RedirectionUrl);
}

function gitgetOAuthClient() {
    return
}

function getAuthUrl () {
    var oauth2Client = getOAuthClient();
    var scopes = [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/plus.login'
    ];
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope : scopes
    });
    return url;
}

app.get("/oauthcallback", function (req, res) {
    var oauth2Client = getOAuthClient();
    var code = req.query.code;
    console.log("\nQuery code:" + code); //Auth req
    oauth2Client.getToken(code, function(err, tokens) {
        if(!err) {
            console.log("Tokens below: ");
            console.log(tokens);
            oauth2Client.credentials = tokens;
            var stream = fs.createWriteStream("credentials.txt");
            stream.once('open', function(fd) {
                stream.write(tokens.access_token);
                stream.write("\n");
                stream.write(tokens.refresh_token);
                stream.end();
            });
            // noinspection JSAnnotator
            res.send(`
                <p>Login successful!!</p>
                <a href="/details">Go to details page</a>
            `);

            console.log("Refresh Token: " + oauth2Client.credentials.refresh_token);

/*            plus.people.get({
                userId: 'me',
                auth: oauth2Client
            }, function (err, response) {
                console.log("error side: ");
                console.log(response);
            })*/
        }
        else{
            // noinspection JSAnnotator
            res.send(`
            <p>Login failed!!</p>
        `);
        }
    });
});

app.get("/details", function (req, res) {
    var oauth2Client = getOAuthClient();
    var arr1 = new Array([]);

    fs.readFile("credentials.txt", function(error, data) {
        if (error) { throw error; }
        data.toString().split("\n").forEach(function(line, index, arr) {
            if (index === arr.length - 1 && line === "") { return; }
            arr1[index] = line;
            console.log(index + " " + line)
        });

        console.log(arr1);

        oauth2Client.credentials = {
            access_token: arr1[0],
            refresh_token: arr1[1],
            expiry_date: true
        };

        plus.people.get({
            userId: 'me',
            auth: oauth2Client
        }, function (err, response) {
            console.log(response);
        })

    });
    fs.unlink("credentials.txt");
});

app.get("/", function (req, res) {
    var url = getAuthUrl();
    //console.log("URL: " + url);
    // noinspection JSAnnotator
    res.send(`
            <p>Authentication using GOOGLE oAuth</p>
            <a href=${url}>Login</a>
    `)

/*    var giturl = authorizationUri;
    console.log("git URL: " + giturl);
    // noinspection JSAnnotator
    res.send(`<br><br>
            <p>Authentication using GIT oAuth</p>
            <a href=${giturl}>Login</a>
    `)*/
});


app.listen(3000, function () {
    console.log("Listen to 3000");
})