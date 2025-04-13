const rentingController = require("./rentingController");
const meterRecordController = require("./meterRecordController");
const client = require("../lineClient");

async function handleSendRentPrice(userId, houseId, month, year) {
  try {
    const data = await rentingController.handleCalculateMonthlyRent(
      houseId,
      month,
      year
    );

    await client.pushMessage(userId, {
      type: "text",
      text:
        `ค่าน้ำค่าไฟของบ้าน ${data.house} เดือน ${data.month}/${data.year}:\n\n` +
        `- ค่าน้ำ: ${data.cost.water} บาท\n` +
        `- ค่าไฟ: ${data.cost.electricity} บาท\n` +
        `- ค่าเช่า: ${data.rent_price} บาท\n` +
        `- รวมทั้งหมด: ${data.total} บาท`,
    });
  } catch (error) {
    console.error("Error sending rent price:", error);
    await client.pushMessage(userId, {
      type: "text",
      text: "เกิดข้อผิดพลาดในการคำนวณค่าเช่า กรุณาลองใหม่อีกครั้ง",
    });
  }
}

async function handleMeterRecordInput(event, text) {
  const numbers = text
    .split(/\s+/)
    .map((n) => Number(n))
    .filter((n) => !isNaN(n) && isFinite(n));

  // 🗓️ Get current month/year (or pass them in if needed)
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // 📥 Analyze which house/meter each number belongs to
  const dbResults = await meterRecordController.checkPreviousMeterRecord(
    numbers,
    month,
    year
  );

  console.log("hi 1");

  // 🧾 Build display text grouped by house
  let displayText = "📊 สรุปข้อมูลมิเตอร์ที่ตรวจพบ:\n";
  const matchedValues = [];

  console.log("hi 2");

  for (const group of dbResults) {
    displayText += `🏠 ${group.house_name}\n`;
    for (const reading of group.readings) {
      displayText += `• ${reading.type === "WATER" ? "น้ำ" : "ไฟ"}: ${
        reading.previous_value
      } ➜ ${reading.current_value}\n`;
      matchedValues.push({
        house_id: group.house_id,
        type: reading.type,
        value: reading.current_value,
        month,
        year,
      });
    }
  }

  console.log("hi 3");

  if (matchedValues.length === 0) {
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "❌ ไม่พบข้อมูลที่ตรงกับเลขที่คุณส่งมา กรุณาตรวจสอบอีกครั้ง",
    });
    return;
  }

  console.log("hi 4");

  // Flattened number list for total and confirmation
  const tempData = encodeURIComponent(JSON.stringify(matchedValues));

  console.log("hi 5");

  await client.replyMessage(event.replyToken, {
    type: "template",
    altText: `${displayText}`,
    template: {
      type: "confirm",
      text: "ต้องการบันทึกข้อมูลเหล่านี้หรือไม่?",
      actions: [
        {
          type: "postback",
          label: "บันทึก",
          data: `action=save&records=${tempData}`,
          // data: `action=save&records=test`,
        },
        {
          type: "postback",
          label: "ยกเลิก",
          data: "action=cancel",
        },
      ],
    },
  });

  console.log("hi 6");
}

async function handleMeterRecordInputConfirmation(event) {
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

module.exports = {
  handleSendRentPrice,
  handleMeterRecordInput,
  handleMeterRecordInputConfirmation,
};
