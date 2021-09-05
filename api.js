const express = require('express');
const router = express.Router();
const SpotifyClient = require('./spotify-client.js');
const { Track, Artist, Metadata } = require('./models.js');
const { Op } = require("sequelize");

router.post('/trackByIsrc/:isrc', async (req, res) => {
    var client = new SpotifyClient({clientId: process.env.SPOTIFY_CLIENT_ID, clientSecret: process.env.SPOTIFY_CLIENT_SECRET});
    const results = await client.getTrackByIsrc(req.params.isrc);

    if (!results.items) {
        return res.status(400).send(`No results found for ISRC ${req.params.isrc}`);
    }

    // per requirements, only store the most popular track for a given request
    let mostPopularTrack = results.tracks.items.sort((track1, track2) => {
        // we're fine with either being selected in the case of a tie
        return track1.popularity > track2.popularity ? 1 : -1;
    }).pop();
    // with no specific requirements, arbitrarily picking the first image if available
    let trackImageUri = mostPopularTrack.album.images.pop().url;

    // requirements seem to imply we're treating any combination of artists like a unique "artist" -- 
    // in the real world I'd get clarification on this req, but since it's a contrived challenge as-is seems fine
    let artistNameList = mostPopularTrack.artists.map((a) => a.name).join(', ');
    let title = mostPopularTrack.name;

    if (await Track.findOne({where: {isrc: req.params.isrc}})) {
        return res.status(422).send('ISRC already stored');
    }
    let track = await Track.create({
        isrc: req.params.isrc,
    });
    let artist = await Artist.create({
        name: artistNameList,
        trackEntityId: track.entityId
    });
    var meta = await Metadata.create({
        imageUri: trackImageUri,
        title: title,
        trackEntityId: track.entityId
    });
    return res.send(`Stored track for ISRC "${req.params.isrc}"`);
});

router.get('/trackByIsrc/:isrc', async (req, res) => {
    let matchingTrack = await Track.findOne({where: {isrc: req.params.isrc}, include: Metadata});
    if (matchingTrack) {
        let metadata = matchingTrack.metadatum
        return res.status(200).send(metadata.dataValues);
    }
    return res.status(404).send('ISRC does not match any stored track');
});

router.get('/trackByArtist/:artist', async (req, res) => {
    let matchingArtists = await Artist.findAll({where: {name: {[Op.like]: `%${req.params.artist}%`}}, include: [Track]});
    if (matchingArtists) {
        let results = {tracks: []};
        for (const matchingArtist of matchingArtists) {
            let track = await matchingArtist.getTrack();
            let metadata = await track.getMetadatum();
            results.tracks.push({
                ...track.dataValues,
                metadata: {
                    ...metadata.dataValues
                },
                artist: {
                    ...matchingArtist.dataValues
                }
            });
        }
            
        return res.status(200).set('Content-type', 'application/json').send(results);
    }
    return res.status(200).set('Content-type', 'application/json').send({});
});

module.exports = router;