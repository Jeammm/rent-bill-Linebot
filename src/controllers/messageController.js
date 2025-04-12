const rentingController = require("./rentingController");
const client = require("../lineClient");

async function handleSendRentPrice(userId, houseId) {
  try {
    const data = await rentingController.handleCalculateMonthlyRent(houseId);

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

module.exports = {
  handleSendRentPrice,
};
