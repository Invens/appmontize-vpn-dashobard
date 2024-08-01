// subscriptionCheck.js
const { User } = require('./models');
const { Op } = require('sequelize'); 
const moment = require('moment');

async function checkSubscriptions() {
  try {
    // Get the current date
    const currentDate = moment().toDate();

    // Find all users whose subscription has expired
    const users = await User.findAll({
      where: {
        SubscriptionEndDate: {
          [Op.lt]: currentDate
        }
      }
    });

    // Update each user to a free or default subscription type
    for (const user of users) {
      await user.update({
        SubscriptionTypeID: 1 // Assuming 1 is the ID for the free/default plan
      });
      console.log(`User ${user.UserID} subscription set to free`);
    }

    console.log('Subscription check completed');
  } catch (error) {
    console.error('Error checking subscriptions:', error);
  }
}

module.exports = { checkSubscriptions };
