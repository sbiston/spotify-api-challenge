const axios = require('axios')

class SimpleSpotifyClient {
    constructor({clientId, clientSecret}) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.bearer;
    }

    getEncodedCredentials () {
        return new Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    }

    getAuthHeader () {
        return {'Authorization': `Bearer ${this.bearer}`}
    }

    async authorize ({force=false}={}) {
        // TODO: determine if bearer is expired and re-auth if so
        if (!this.bearer || force) {
            return axios({
                url: 'https://accounts.spotify.com/api/token',
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${this.getEncodedCredentials()}`,
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                // API requires x-www-form-urlencoded submission for this endpoint, so we have to pass URL encoded data
                data: 'grant_type=client_credentials'
            }).then((response) => {
                console.log('Auth successful!');
                this.bearer = response.data.access_token
                return response;
            }).catch((e) => {
                // TODO: Better error handling here, or perhaps even better just remove this and leave error handling
                // to the consuming class
                console.log(e);
            });
        } else {
            // allow for indiscriminate calls to authorize() even when not necessary which don't break Promise chains
            return new Promise();
        }
    }

    async getTrackByIsrc(isrc) {
        return this.authorize().then(() => {
            return axios({
                url: `https://api.spotify.com/v1/search?q=isrc:${isrc}&type=track`,
                method: 'GET',
                responseType: 'json',
                headers: {
                    ...this.getAuthHeader()
                }
            }).then((response) => {
                return response.data;
            }).catch((e) => {
                console.log(e)
            });
        });
    }
}

module.exports = SimpleSpotifyClient;