const messageController = require("../controllers/messageController");

async function messageRoute(req, res) {
  const events = req.body.events;

  console.log("events:", events);

  for (const event of events) {
    if (event.type === "message") {
      switch (event.message.text) {
        case "ค่าน้ำค่าไฟ":
          await messageController.handleSendRentPrice(event.source.userId, 5, 3, 2025);
          break;
      }
    }
  }

  res.sendStatus(200);
}

module.exports = messageRoute;
