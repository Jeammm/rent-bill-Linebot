const fs = require("fs");
const generateSlip = require("../genSlipImage");
const sendSlipImage = require("../sendSlipImage");

async function handleSendSlip(userId, rentData) {
  const slipPath = await generateSlip(rentData);
  const slipBuffer = fs.readFileSync(slipPath);
  await sendSlipImage(userId, slipBuffer);
}

async function handleSlip(req, res) {
  const events = req.body.events;

  res.sendStatus(200);
  await client.pushMessage(userId, {
    type: "image",
    originalContentUrl:
      "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=12%2C96%2C2671%2C1335&q=45&auto=format&w=1356&h=668&fit=crop",
    previewImageUrl:
      "https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=12%2C96%2C2671%2C1335&q=45&auto=format&w=1356&h=668&fit=crop",
  });

  // for (const event of events) {
  //   if (event.type === "message" && event.message.text === "ค่าน้ำค่าไฟ") {
  //     const rentData = await calculateRentForUser(event.source.userId); // your logic
  //     await handleSendSlip(event.source.userId, rentData);
  //   }
  // }

  // res.sendStatus(200);
}

module.exports = handleSlip;
