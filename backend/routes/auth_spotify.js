/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

const express = require("express");
const router = express.Router();
require("dotenv").config();
let { spotifyApi, updateState } = require("../utils/commons");

function getRandomString() {
    let random_str = Buffer.from(Math.random().toString()).toString("base64").substring(10, 15);
    let timestamp_str = Date.now().toString().substring(7);
    return random_str + timestamp_str;
}

let scopes = ["streaming"],
    // Store the state so it can be checked by callback route
    state = getRandomString();
updateState(state);
function spotify_url(req, res) {
    var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
    console.log("auth_spotify.js", authorizeURL);
    res.status(200).send(authorizeURL);
}

router.get("/url", (req, res) => spotify_url(req, res));

module.exports = {
    path: "/auth", // The main entrance to this route aka /
    handler: router, // The router object that handles this route
};
