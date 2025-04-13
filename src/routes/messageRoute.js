const messageController = require("../controllers/messageController");

function parseThaiMonthYear(text) {
  const monthMatch = text.match(/เดือน\s*(\d{1,2})/);
  const yearMatch = text.match(/ปี\s*(\d{4})/);

  const month = monthMatch ? parseInt(monthMatch[1]) : null;
  const year = yearMatch ? parseInt(yearMatch[1]) : null;

  return { month, year };
}

async function messageRoute(req, res) {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const text = event.message.text.trim();

      // Check for rent request message
      if (/ค่าน้ำค่าไฟ|ค่าห้องเช่า/.test(text)) {
        const { month, year } = parseThaiMonthYear(text);
        await messageController.handleSendAllRentPrices(
          event,
          month,
          year
        );
        continue;
      }

      // Check if it's a space-separated list of numbers
      if (/^(\d+\s*)+$/.test(text)) {
        await messageController.handleMeterRecordInput(event, text);
        continue;
      }
    }

    // Handle postback
    else if (event.type === "postback") {
      await messageController.handleMeterRecordInputConfirmation(event);
    }
  }

  res.sendStatus(200);
}

module.exports = messageRoute;
