const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS package
const cookieParser = require('cookie-parser');
const panchangRoutes = require('./routes/panchangRoutes');
const matchingRoutes  = require('./routes/kundaliRoutes');
const authRoutes = require('./routes/authRoutes')
const userRoutes  = require('./routes/userRoutes')
const horoscopeRoutes = require('./routes/horoscopeRoutes');
const nakshatraRoutes = require('./routes/nakshtraRoutes');
const blogRoutes = require('./routes/blogRoutes');
const birthchart = require('./routes/birthChartRoutes');
const monthlySalesRoutes = require('./routes/monthlySalesRoutes');
const eventRoutes = require('./routes/eventRoutes');
const yearlyEventRoutes = require('./routes/yearlyEventRoutes')
const app = express();
app.use(cookieParser());
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (including uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));


// Use routes
app.use('/blogs', blogRoutes);
app.use('/panchang', panchangRoutes);
app.use('/kundali', matchingRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/horoscope', horoscopeRoutes);
app.use('/birthChart', birthchart);
app.use('/nakshtra', nakshatraRoutes);
app.use('/offers', require('./routes/offersRoutes'));
app.use('/services', require('./routes/servicesRoutes'));
app.use('/products', require('./routes/productsRoutes'));
app.use('/monthly-sales', monthlySalesRoutes);
app.use('/event', eventRoutes);
app.use('/yearlyevent', yearlyEventRoutes)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
