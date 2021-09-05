require("dotenv").config();

const { sequelize } = require('./app/db.js');
require('./app/models.js');

sequelize.sync({force: true}).then(() => { 
    console.log("Database synced!");
    process.exit(0);
});
