const fs = require('fs');
const path = require('path');
const client = require('./lineClient');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

async function sendSlipImage(userId, slipBuffer) {
  // Upload image to a temporary hosting service or your server
  const filename = `${uuidv4()}.png`;
  const localPath = path.join(__dirname, "temp", filename);
  fs.writeFileSync(localPath, slipBuffer);

  // Assuming you serve files from /public (e.g., https://your-domain.com/public/slips/xxx.png)
  const imageUrl = `https://my-api-server-with-swagger-production.up.railway.app/${filename}`;

  // Move or copy file to public folder
  const publicPath = path.join(__dirname, "public/slips", filename);
  fs.copyFileSync(localPath, publicPath);

  // Send image message to LINE user
  await client.pushMessage(userId, {
    type: 'image',
    originalContentUrl: imageUrl,
    previewImageUrl: imageUrl,
  });

  return imageUrl;
}

module.exports = sendSlipImage;