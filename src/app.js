const express = require("express");
const app = express();
const houseRoutes = require("./routes/houseRoutes");
const meterRecordRoutes = require("./routes/meterRecordRoutes");
const rentingRoutes = require("./routes/rentingRoutes");
const handleSendSlip = require("./controllers/handleSendSlip");

require("dotenv").config();

app.use(express.json());

app.use("/api/houses", houseRoutes);
app.use("/api/meter-records", meterRecordRoutes);
app.use("/api/rentings", rentingRoutes);

app.post('/webhook', express.json(), async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.text === 'ค่าน้ำค่าไฟ') {
      const rentData = await calculateRentForUser(event.source.userId); // your logic
      await handleSendSlip(event.source.userId, rentData);
    }
  }

  res.sendStatus(200);
});

const { swaggerUi, specs } = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
