const fs = require('fs');
const generateSlip = require('../genSlipImage');
const sendSlipImage = require('../sendSlipImage');

async function handleSendSlip(userId, rentData) {
  const slipPath = await generateSlip(rentData);
  const slipBuffer = fs.readFileSync(slipPath);
  await sendSlipImage(userId, slipBuffer);
}

module.exports = handleSendSlip;