const express = require("express");
const app = express();
const houseRoutes = require("./routes/houseRoutes");
const meterRecordRoutes = require("./routes/meterRecordRoutes");
const rentingRoutes = require("./routes/rentingRoutes");
require("dotenv").config();

app.use(express.json());

app.use("/api/houses", houseRoutes);
app.use("/api/meter-records", meterRecordRoutes);
app.use("/api/rentings", rentingRoutes);

const { swaggerUi, specs } = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
