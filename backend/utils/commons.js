const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

let appState = "";
const updateState = (newState) => {
    appState = newState;
};
const getState = () => appState;

let tokenExpiresIn = 0;
const setTokenExpiresIn = (newTime) => {
    tokenExpiresIn = newTime;
};
const getTokenExpiresIn = () => tokenExpiresIn;

module.exports = {
    spotifyApi: spotifyApi,
    getAppState: getState,
    updateState: updateState,
    setTokenExpiresIn: setTokenExpiresIn,
    getTokenExpiresIn: getTokenExpiresIn,
};
