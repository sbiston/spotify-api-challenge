const { sequelize } = require('./db.js');
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
    sequelize,
    modelName: 'artist'
});

Track.init({
    entityId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    isrc: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'track'
});

Metadata.init({
   entityId: {
       type: DataTypes.STRING,
       allowNull: false,
       primaryKey: true
   },
   imageUri: {
       type: DataTypes.STRING,
   },
   title: {
       type: DataTypes.STRING,
       allowNull: false
   }
}, {
    sequelize,
    modelName: 'metadata'
});

Track.hasOne(Artist);
Artist.belongsTo(Track);
Track.hasOne(Metadata);
Metadata.belongsTo(Track);

module.exports = {
    Artist,
    Track,
    Metadata
}