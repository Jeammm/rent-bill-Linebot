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

  console.log("events:", events);

  for (const event of events) {
    if (event.type === "message") {
      const text = event.message.text;

      if (/ค่าน้ำค่าไฟ|ค่าห้องเช่า/.test(text)) {
        const { month, year } = parseThaiMonthYear(text);
        await messageController.handleSendRentPrice(
          event.source.userId,
          5,
          month,
          year
        );
      }
    }
  }

  res.sendStatus(200);
}

module.exports = messageRoute;
