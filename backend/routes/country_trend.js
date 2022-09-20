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

async function country_trends(limit = 10, country) {
    let aKey = process.env.LASTFM_API_KEY;
    let url = `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${country}&api_key=${aKey}&format=json&limit=${limit}`;

    // fetch 10 most popular songs for the country.
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // do something with data
        });
    return "HI";
}
async function run(req, res) {
    // console.log(await get_user(access_token, "jmperezperez"));
    country = req.params["country"];
    res.send(country_trends("USA"));
}

router.get("", (req, res) => run(req, res));

module.exports = {
    path: "/trend", // The main entrance to this route aka /
    handler: router, // The router object that handles this route
};
