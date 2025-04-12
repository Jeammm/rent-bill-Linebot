const express = require('express');
const app = express();
const roomRoutes = require('./routes/roomRoutes');
require('dotenv').config();

app.use(express.json());

app.use('/api/rooms', roomRoutes);
const { swaggerUi, specs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
