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
const fetch = require("node-fetch");
require("dotenv").config();
const { spotifyApi } = require("../utils/spotifyApiObj");

async function spotify_login() {
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
    const token = spotifyApi.getAccessToken();
    console.log("token:\n", token);
}
spotify_login();

async function country_trends(country, limit = 10) {
    let aKey = process.env.LASTFM_API_KEY;
    let url = `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${country}&api_key=${aKey}&format=json&limit=${limit}`;

    // fetch 10 most popular songs for the country.
    let trend_data = await fetch(url)
        .then((response) => response.json())
        .then((data) => data.tracks.track)
        .catch((err) => console.log(err));
    console.log(trend_data);
    // search tracks based on track name and artist name
    // do this for every track of the list (total # limit)
    spotify_data = Promise.all(
        trend_data.map(async (td) => {
            data = await spotifyApi.searchTracks(`track:${td.name} artist:${td.artist.name}`).then(
                (d) => d.body.tracks.items[0],
                (err) => {
                    console.log("Something went wrong!", err);
                }
            );

            if (data) {
                return {
                    id: data["id"] ?? undefined,
                    track_name: data["name"] ?? undefined,
                    artist_name: data["artists"][0]["name"] ?? undefined,
                    album_name: data["album"]["name"] ?? undefined,
                    listeners: td["listeners"] ?? undefined,
                    url: data["external_urls"] ?? undefined,
                    popularity: data["popularity"] ?? undefined,
                    images: data["album"]["images"] ?? undefined,
                    available_markets: data["available_markets"] ?? undefined,
                    uri: data["uri"] ?? undefined,
                };
            } else {
                // TODO: if you couldn't find it, try with the track name only
                return {};
            }
        })
    );
    console.log(spotify_data);
    return spotify_data;
}
async function run(req, res) {
    // console.log(await get_user(access_token, "jmperezperez"));
    country = req.query["country"];
    if (country) {
        data = await country_trends(country);
        res.setHeader("Content-Type", "application/json");
        res.json(data);
    } else {
        res.status(400).send("Country parameter is required.");
    }
}

router.get("", (req, res) => run(req, res));

module.exports = {
    path: "/trend", // The main entrance to this route aka /
    handler: router, // The router object that handles this route
};
