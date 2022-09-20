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
const fetch = require("node-fetch");

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret

var urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "client_credentials");

var requestOptions = {
    method: "POST",
    headers: {
        Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlencoded,
    redirect: "follow",
};

async function get_token(params) {
    // your application requests authorization
    return fetch("https://accounts.spotify.com/api/token", requestOptions).then((res) =>
        res.json()
    );
    // return token;
    // let res = await request.post(authOptions, function (error, response, body) {
    //     // console.log(body);
    //     if (!error && response.statusCode === 200) {
    //         // use the access token to access the Spotify Web API
    //         token = body.access_token;
    //         // var options = {
    //         //     url: "https://api.spotify.com/v1/users/jmperezperez",
    //         //     headers: {
    //         //         Authorization: "Bearer " + token,
    //         //     },
    //         //     json: true,
    //         // };
    //         // request.get(options, function (_error, _response, body) {
    //         //     console.log(body);
    //         // });
    //     }
    // });
    // console.log(res);
}
async function run() {
    let token = await get_token();
    console.log("here", token);
}

router.get("", run);

module.exports = {
    path: "/auth", // The main entrance to this route aka /
    handler: router, // The router object that handles this route
};
