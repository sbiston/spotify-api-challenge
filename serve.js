const app = require('./app/app.js');
const api = require('./app/api.js');

app.use(`/api/v${process.env.API_VERSION}`, api);

const port = 9000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}!`);
});