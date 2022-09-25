const auth = require("./auth_spotify.js");
const trend = require("./country_trend.js");
const callback = require("./callback.js");

module.exports.routes = [
    auth, // authentication process for spotify
    trend,
    callback,
];
