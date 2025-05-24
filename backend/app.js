const express = require('express');
const cors = require('cors');
const app = express();
const santaRoutes = require('./routes/santaRoutes');


app.use(cors()); // Add this
app.use('/api', santaRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
