const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

function formatNumber(num) {
  return num.toLocaleString("en-US");
}

async function generateSlip(data) {
  const width = 600;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#000";
  ctx.font = "28px sans-serif";
  ctx.fillText(`ค่าเช่าบ้าน - ${data.house}`, 30, 50);

  ctx.font = "22px sans-serif";

  const tableData = [
    ["รายการ", "จำนวน", "ราคา"],
    ["ค่าน้ำ", formatNumber(data.usage.water), formatNumber(data.cost.water)],
    ["ค่าไฟ", formatNumber(data.usage.electricity), formatNumber(data.cost.electricity)],
    ["ค่าเช่าห้อง", "-", formatNumber(data.rent_price)],
    ["รวมทั้งสิ้น", "", formatNumber(data.total)],
  ];

  const startY = 100;
  const rowHeight = 50;
  const colX = [30, 300, 450];

  tableData.forEach((row, i) => {
    const y = startY + i * rowHeight;
    row.forEach((text, j) => {
      ctx.fillText(text, colX[j], y);
    });
  });

  // Save or return buffer
  const outputPath = path.join(__dirname, "slip.png");
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);

  return outputPath; // or return buffer if sending via LINE API
}

module.exports = generateSlip;