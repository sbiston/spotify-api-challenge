const { sequelize } = require('./db.js');
require('./models.js');

sequelize.sync({force: true}).then(() => { 
    console.log("Database synced!");
    process.exit(0);
});
