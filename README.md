# Spotify API Challenge

A simple API server whose purpose is to persist Spotify track metadata to a database and expose endpoints which make that data readily retrievable.

## Environment Setup

This project uses NodeJS 12, I recommend using `nvm` to assist in managing multiple versions of NodeJS on a single environment: https://github.com/nvm-sh/nvm. The provided database setup for the development environment requires Docker, however a MySQL server setup of any kind should slot in simply by replacing the appropriate `.env` variables (covered later): 
* https://docs.docker.com/get-docker/
* https://docs.docker.com/compose/install/

1. Run `npm install`.
2. Copy `.env.example` to `.env`
    1. Ensure each variable in the `.env` file is populated appopriately (the variable names should clearly indicate the expected value)
        1. For the `SPOTIFY_CLIENT` and `SPOTIFY_CLIENT_SECRET` values, you'll need to register for a Spotify Developer account and create an app: https://developer.spotify.com/dashboard/
2. If using the provided Docker database
    1. Under `./docker-secrets`, create two files: `mysql_database` and `mysql_root_pw` containing just the text of the appropriate values you'd like used for the database upon creation. These values should correspond to the values input in the `.env` file
3. Run the MySQL database, for the provided Docker database simply run `docker-compose up`
4. Initialize the API database by running `npm run db:sync`
5. Run the API server with `npm start`


## API Usage

See https://app.swaggerhub.com/apis/sjb9774/spotify-api-challenge/0.0.1
