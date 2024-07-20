// models/recentlyConnectedServer.js
module.exports = (sequelize, DataTypes)=>{
    const  recentlyConnectedServer = sequelize.define( 'recentServers',{
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          serverName: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          connectionTime: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          dataUsed: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },    
    }
    );
return recentlyConnectedServer;
}
