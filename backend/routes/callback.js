const express = require("express");
const router = express.Router();
require("dotenv").config();
const { spotifyApi } = require("../utils/spotifyApiObj");

async function run(req, res) {
    let code = req.query.code;
    console.log(code);
    // TODO: check the state is same as provided to the client
    if (code) {
        spotifyApi.authorizationCodeGrant(code).then(
            function (data) {
                console.log("The token expires in " + data.body["expires_in"]);
                console.log("The access token is " + data.body["access_token"]);
                console.log("The refresh token is " + data.body["refresh_token"]);

                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body["access_token"]);
                spotifyApi.setRefreshToken(data.body["refresh_token"]);
            },
            function (err) {
                console.log("Something went wrong!", err);
            }
        );
        res.status(200).send("OK!");
    } else {
        res.status(400).send("Bad request");
    }
}

router.get("", (req, res) => run(req, res));

module.exports = {
    path: "/callback", // The main entrance to this route aka /
    handler: router, // The router object that handles this route
};
