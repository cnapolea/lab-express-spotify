// jshint esversion:10
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const PORT = process.env.PORT;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRETE = process.env.SPOTIFY_CLIENT_SECRETE;

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

// setting the spotify-api goes here:
const spotifyAPI = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRETE,
});

spotifyAPI.clientCredentialsGrant()
    .then(data => spotifyAPI.setAccessToken(data.body['access_token']))
    .catch(error => {
        console.log(error.message);
    });

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index', {
        bgImg:'/images/spotify-background.jpeg'
    });
});

app.get('/artist-search', (req, res) => {
    const reqData = req.query;
    spotifyAPI.searchArtists(reqData['artist-name'])
        .then(data => {
            res.render('artist_search', {
                artistInfo: data.body.artists.items,
            });
        })
        .catch(error => console.log(error.message));
});

app.get('/albums/:artistId', (req, res) => {
    const artistId = req.params.artistId;
    
    spotifyAPI.getArtistAlbums(artistId)
    .then(data => {
        res.render('view_albums', 
        {
            Album: data.body.items,
        });
    })
    .catch(error => console.log(error));

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));