const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  host: 'localhost', // replace with your host
  database: 'vpn_dashboard', // replace with your database name
  username: 'root', // replace with your database username
  password: '', // replace with your database password
  dialect: 'mysql', // or your database dialect
});

const SubscriptionType = require('./models/subscriptionType')(sequelize, DataTypes);
const User = require('./models/user')(sequelize, DataTypes);

sequelize.sync({ force: true }).then(async () => {
  await SubscriptionType.bulkCreate([
    {
      SubscriptionTypeID: 1,
      Name: 'Monthly Subscription',
      Description: 'Monthly subscription type',
      Price: 10.00,
      Duration: 30,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    },
    {
      SubscriptionTypeID: 2,
      Name: 'Half-Yearly Subscription',
      Description: 'Half-yearly subscription type',
      Price: 50.00,
      Duration: 182,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    },
    {
      SubscriptionTypeID: 3,
      Name: 'Yearly Subscription',
      Description: 'Yearly subscription type',
      Price: 90.00,
      Duration: 365,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    }
  ]);

  console.log('Database synchronized and default subscription types inserted.');
  sequelize.close();
}).catch(console.error);