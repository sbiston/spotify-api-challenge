const app = require('./app.js');
const api = require('./api.js');

app.use(`/api/v${process.env.API_VERSION}`, api);

const port = 9000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}!`);
});