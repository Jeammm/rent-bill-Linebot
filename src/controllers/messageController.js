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
  try {
    const numbers = text
      .split(/\s+/)
      .map((n) => Number(n))
      .filter((n) => !isNaN(n) && isFinite(n));

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const dbResults = await meterRecordController.checkPreviousMeterRecord(
      numbers,
      month,
      year
    );

    console.log("dbResults", dbResults, numbers);

    let displayText = "📊 สรุปข้อมูลมิเตอร์ที่ตรวจพบ:\n";
    const insertedIds = [];

    for (const group of dbResults) {
      displayText += `\n🏠 ${group.house_name}\n`;
      for (const reading of group.readings) {
        displayText += `• ${reading.type === "WATER" ? "น้ำ" : "ไฟ"}: ${
          reading.previous_value
        } ➜ ${reading.current_value}\n`;

        const inserted = await meterRecordController.createRecordHandler({
          house_id: group.house_id,
          type: reading.type,
          value: reading.current_value,
          month,
          year,
          confirmed: false,
        });

        insertedIds.push(inserted.id);
      }
    }

    if (insertedIds.length === 0) {
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "❌ ไม่พบข้อมูลที่ตรงกับเลขที่คุณส่งมา กรุณาตรวจสอบอีกครั้ง",
      });
      return;
    }

    await client.replyMessage(event.replyToken, [
      {
        type: "text",
        text: `${displayText}`,
      },
      {
        type: "template",
        altText: "Confirm the data",
        template: {
          type: "confirm",
          text: "ต้องการยืนยันการบันทึกข้อมูลหรือไม่?",
          actions: [
            {
              type: "postback",
              label: "ยืนยัน",
              data: `action=save&ids=${insertedIds.join(",")}`,
            },
            {
              type: "postback",
              label: "ยกเลิก",
              data: "action=cancel",
            },
          ],
        },
      },
    ]);
  } catch (error) {
    client.replyMessage(event.replyToken, [
      {
        type: "text",
        text: `error: ${error.message}`,
      },
    ]);
  }
}

async function handleMeterRecordInputConfirmation(event) {
  const data = new URLSearchParams(event.postback.data);
  const action = data.get("action");

  if (action === "save") {
    try {
      const ids = data
        .get("ids")
        .split(",")
        .map((id) => parseInt(id, 10));
      for (const id of ids) {
        await meterRecordController.confirmMeterRecord(id);
      }

      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "✅ ยืนยันและบันทึกข้อมูลสำเร็จแล้ว",
      });
    } catch (err) {
      console.error("Error confirming meter records:", err);
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "❌ เกิดข้อผิดพลาดในการยืนยันข้อมูล",
      });
    }
  } else if (action === "cancel") {
    try {
      for (const id of ids) {
        await meterRecordController.cancelMeterRecord(id);
      }
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "🚫 ยกเลิกการบันทึกข้อมูลแล้ว",
      });
    } catch (error) {
      console.error("Error cancelling meter records:", error);
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "❌ เกิดข้อผิดพลาดในการยกเลิกข้อมูล",
      });
    }
  }
}

module.exports = {
  handleSendRentPrice,
  handleMeterRecordInput,
  handleMeterRecordInputConfirmation,
};
