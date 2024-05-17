const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes.js'); // Adjusted path
const adminRoutes = require('./routes/adminRoutes'); // Adjusted path
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
// Allow all origins
app.use(cors());

// Mount user routes
app.use('/user', userRoutes);

// Mount admin routes
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
