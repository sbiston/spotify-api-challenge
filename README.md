# Spotify API Challenge

A simple API server whose purpose is to persist Spotify track metadata to a database and expose endpoints which make that data readily retrievable.

## Environment Setup

This project uses NodeJS 12, I recommend using `nvm` to assist in managing multiple versions of NodeJS on a single environment: https://github.com/nvm-sh/nvm. The provided database setup for the development environment requires Docker, however a MySQL server setup of any kind should slot in simply by replacing the appropriate `.env` variables (covered later): 
* https://docs.docker.com/get-docker/
* https://docs.docker.com/compose/install/

1. Run `npm install`.
2. Copy `.env.example` to `.env`
    1. Ensure each variable in the `.env` file is populated appopriately (the variable names should clearly indicate the expected value)
        1. For the `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` values, you'll need to register for a Spotify Developer account and create an app: https://developer.spotify.com/dashboard/
2. If using the provided Docker database
    1. Under `./docker-secrets`, create two files: `mysql_database` and `mysql_root_pw` containing just the text of the appropriate values you'd like used for the database upon creation. These values should correspond to the values input in the `.env` file
3. Run the MySQL database, for the provided Docker database simply run `docker-compose up`
4. Initialize the API database by running `npm run db:sync`
5. Run the API server with `npm start`


## API Usage

See https://app.swaggerhub.com/apis/sjb9774/spotify-api-challenge/0.0.1


## Securing the API

Since this is only an example project, the API endpoints defined herein are not secured. There are a number of approaches we can take into consideration when it comes to securing the endpoints we expose, including but not limited to:

1. Broadly restrciting access
    1. There are cases where only a single party is ever expected to have access to a given endpoint (for instance, if this was intended to be a server-to-server only API to be used for a single app), in which case we could implement IP whitelisting to allow only requests from the expected source to ever access the endpoints in the first place. These checks would be added at a server configuration level, not within this codebase.
2. Token authentication
    1. The Spotify API itself, which this API interacts with, uses a simple OAuth implementation to allow for token-based authentication; we could mimic this functionality within this API to provide a similar level of security.
    2. The basic flow here involves exposing an endpoint for generating token based on a set of credentials (`CLIENT_SECRET` and `CLIENT_ID` in the case of the Spotify endpoint). The token produced from this endpoint can be passed as a header to the other endpoints in the API.
        1. We gain advantages here by being able to expire these tokens regularly, revoke them as needed, as well as being able to exercise control over the credentials which can generate the tokens in the first place
3. Add permissions and roles in conjunction with token auth
    1. As-is the API provided has no limits on who can invoke which endpoint or how often, a common pattern to manage access to an API is to provide for different access for different users by defining roles and permissions. For example, there could be a role for read-only users granted generously to users/applications which need only read data from this API, and so we could better manage the population of new data in our database by being more strict with who is able to become a read/write user.
        1. Our API would be able to identify the role of a user via their credentials passed to the create-token endpoint, and the appropriate permissions could then be applied to the resulting token