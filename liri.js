require('dotenv').config()

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var useApp = process.argv[2];

var useSearch = process.argv.slice(3).join(" ";)