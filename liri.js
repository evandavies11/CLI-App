require('dotenv').config()

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var useApp = process.argv[2];

var userSearch = process.argv.slice(3).join(" ");

function liriRun(useApp, userSearch) {
    switch (useApp) {
        case "movie-this":
            getOMBD(userSearch);
            break;
        case "concert-this":
            getBandsInTown(userSearch);
            break;
        case "spotify-this-song":
            getSpotify(userSearch);
    }
};

function getOMBD(movie) {

    if (!movie) {
        movie = "Mr.Nobody";
    };

    //how it works before switch case
    //var movieName = process.argv[2];

    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    console.log(movieQueryUrl);

    //function GetOMDB(movie) {

    axios.get(movieQueryUrl).then(
        function (response) {
            console.log("===================================");
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            //console.log("RT Rating: " + response.data.rating[1].Value);
            console.log("Country Made: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors " + response.data.Actors);



        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
};

function getSpotify(songName) {
    var spotify = new Spotify(keys.spotify);

    if (!songName) {
        songName = "The Sign";
    };
    //console.log(songName)

    spotify.search({ type: "track", query: songName }, function (err, data) {
        if (err) {
            return console.log("error" + err);
        }

        console.log("===================================");
        console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");
        console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
        console.log("Album: " + data.tracks.items[0].album.name + "\r\n");

        var logSong = " ==Spotify==" + data.track.items[0].album.artists[0].name;

        fs.appendFile("log.txt", logSong, function (err) {
            if (err) throw err;
        });
    })
};

function getBandsInTown(artist) {

    var artist = userSearch;
    var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(bandQueryURL).then(
        function (response) {

            console.log("===================================");
            console.log("Venue: " + response.data[0].venue.name + "\r\n");
            console.log("Location: " + response.data[0].venue.city + "\r\n");
            console.log("Date: " + moment(response.data[0].datetime).format("MM-DD-YYYY"));

            var logConcert = " ==BandsinTown== " + artist + venue;

            fs.appendFile("log.txt", logConcert, function (err) {
                if (err) throw err;
            });
        }
    )
};

liriRun(useApp, userSearch);