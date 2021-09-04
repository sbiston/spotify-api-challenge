const { database } = require('./db.js');
const { DataTypes, Model } = require('sequelize');

class Artist extends Model {}
class Track extends Model {}
class Metadata extends Model {}


Artist.init({
    entityId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    }
}, {
    sequelize: database,
    modelName: 'Artist'
});

Track.init({
    entityId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    artistId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Artist,
            key: 'entityId'
        }
    },
    isrc: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database,
    modelName: 'Track'
});

Metadata.init({
   entityId: {
       type: DataTypes.STRING,
       allowNull: false,
       primaryKey: true
   },
   trackId: {
       type: DataTypes.STRING,
       allowNull: true,
       references: {
           model: Track,
           key: 'entityId'
       }
   },
   imageUri: {
       type: DataTypes.STRING,
   },
   title: {
       type: DataTypes.STRING,
       allowNull: false
   }
}, {
    sequelize: database,
    modelName: 'Metadata'
});
