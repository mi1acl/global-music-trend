const express = require("express");
const router = express.Router();
require("dotenv").config();
const {
    spotifyApi,
    getAppState,
    setTokenExpiresIn,
    getTokenExpiresIn,
} = require("../utils/commons");

let authed = false;
async function run(req, res) {
    let code = req.query.code;
    let state = req.query.state;
    let appState = getAppState();
    if (appState !== state) {
        // TODO: send appropriate response when state mismatches
        console.error("state is not the same", state, appState);
    }
    if (code) {
        spotifyApi.authorizationCodeGrant(code).then(
            (data) => {
                let access_token, refresh_token, expires_in;
                access_token = data.body["access_token"];
                expires_in = data.body["expires_in"];

                refresh_token = data.body["refresh_token"];
                // console.log("The token expires in " + expires_in);
                // console.log("The access token is " + access_token);
                // console.log("The refresh token is " + refresh_token);
                console.log(data.body);
                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body["access_token"]);
                spotifyApi.setRefreshToken(data.body["refresh_token"]);
                setTokenExpiresIn(expires_in);
                authed = true;
                res.send("Authentication successful!");
            },
            function (err) {
                console.log("Something went wrong!", err);
                res.status(500).send("Something went wrong!");
            }
        );
    } else {
        res.status(400).send("Bad request");
    }
}

router.get("", (req, res) => run(req, res));

// TODO: remove this use proper auth from client side to get the token (used for the player)
function experimental_get_token(req, res) {
    res.json({
        token: spotifyApi.getAccessToken(),
        refresh_token: spotifyApi.getRefreshToken(),
        expires_in: getTokenExpiresIn(),
    });
}
router.get("/test", (req, res) => experimental_get_token(req, res));

function getAuthed(req, res) {
    if (spotifyApi.getAccessToken()) {
        authed = true;
    }
    res.json({ authed: authed });
}

router.get("/authed", (req, res) => getAuthed(req, res));

module.exports = {
    path: "/callback", // The main entrance to this route aka /
    handler: router, // The router object that handles this route
};
