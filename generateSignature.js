const crypto = require('crypto');

const secret = "dsklfjhdskfhjlakjdfhaskldfhhkjdfhaadfhjsakjlfhkjdfhsa"; // Your webhook secret
const body = JSON.stringify({
  "razorpay_payment_id": "pay_OVeYxmOCPN8WCn",
  "razorpay_order_id": "order_OVeYZWFlxwZMg6"
});

const shasum = crypto.createHmac('sha256', secret);
shasum.update(body);
const digest = shasum.digest('hex');

console.log('Generated Digest:', digest);
