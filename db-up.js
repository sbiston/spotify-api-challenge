const { database } = require('./db.js');
require('./models.js');

database.sync({force: true}).then(() => { 
    console.log("Database synced!");
    process.exit(0);
})
