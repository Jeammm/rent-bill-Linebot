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
        await messageController.handleSendRentPrice(
          event.source.userId,
          5,
          month,
          year
        );
        continue;
      }

      // Check if it's a space-separated list of numbers
      if (/^(\d+\s*)+$/.test(text)) {
        const numbers = text.split(/\s+/).map(Number);
        const total = numbers.reduce((sum, n) => sum + n, 0);
        const tempData = numbers.join(",");

        await client.replyMessage(event.replyToken, {
          type: "template",
          altText: "Confirm the data",
          template: {
            type: "confirm",
            text: `คุณใส่ตัวเลข: ${numbers.join(
              ", "
            )}\nรวม: ${total}\nต้องการบันทึกหรือไม่?`,
            actions: [
              {
                type: "postback",
                label: "บันทึก",
                data: `action=save&numbers=${tempData}`,
              },
              {
                type: "postback",
                label: "ยกเลิก",
                data: "action=cancel",
              },
            ],
          },
        });
      }
    }

    // Handle postback
    else if (event.type === "postback") {
      const data = new URLSearchParams(event.postback.data);
      const action = data.get("action");

      if (action === "save") {
        const numbers = data.get("numbers").split(",").map(Number);
        // 💾 TODO: Save numbers to database here
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: `บันทึกข้อมูลแล้ว: ${numbers.join(", ")}`,
        });
      } else if (action === "cancel") {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "ยกเลิกการบันทึกข้อมูล",
        });
      }
    }
  }

  res.sendStatus(200);
}

module.exports = messageRoute;
