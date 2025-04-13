const rentingController = require("./rentingController");
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
