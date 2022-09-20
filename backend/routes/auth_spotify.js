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
// const fetch = require("node-fetch");
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID, // Your client id
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // Your secret
});

// Get an access token and 'save' it using a setter
spotifyApi.clientCredentialsGrant().then(
    function (data) {
        console.log("The access token is " + data.body["access_token"]);
        spotifyApi.setAccessToken(data.body["access_token"]);
    },
    function (err) {
        console.log("Something went wrong!", err);
    }
);

// function get_token(client_id, client_secret) {
//     /**
//      * Returns a promise for a bearer token
//      */
//     var urlencoded = new URLSearchParams();
//     urlencoded.append("grant_type", "client_credentials");
//     let requestOptions = {
//         method: "POST",
//         headers: {
//             Authorization:
//                 "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
//             "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: urlencoded,
//         redirect: "follow",
//     };

//     return fetch("https://accounts.spotify.com/api/token", requestOptions).then((res) =>
//         res.json()
//     );
// }
// async function get_user(token, username) {
//     let url = `https://api.spotify.com/v1/users/${username}`;
//     console.log(`Bearer ${token}`);
//     var options = {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//         "Content-Type": "application/json",
//     };
//     return fetch(url, options).then((res) => res.json());
//     // let res = await request.post(authOptions, function (error, response, body) {
//     //     // console.log(body);
//     //     if (!error && response.statusCode === 200) {
//     //         // use the access token to access the Spotify Web API
//     //         token = body.access_token;
//     //         // request.get(options, function (_error, _response, body) {
//     //         //     console.log(body);
//     //         // });
//     //     }
//     // });
//     // console.log(res);
// }
async function run() {
    // let token = await get_token(client_id, client_secret);
    // let access_token = token.access_token;
    // Get an access token and 'save' it using a setter

    const token = spotifyApi.getAccessToken();
    console.log("token:\n", token);
    // console.log(await get_user(access_token, "jmperezperez"));
}

router.get("", run);

module.exports = {
    path: "/auth", // The main entrance to this route aka /
    handler: router, // The router object that handles this route
};
