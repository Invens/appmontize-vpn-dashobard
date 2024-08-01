// testSubscriptionCheck.js
const { checkSubscriptions } = require('./subscriptionCheck');

async function test() {
  await checkSubscriptions();
  console.log('Test subscription check completed');
}

test();
