// Import necessary packages
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http'); // Required for creating an HTTP server
const initializeSocket = require('./config/socket'); // Import the Socket.io configuration

// Import routes
const panchangRoutes = require('./routes/panchangRoutes');
const matchingRoutes = require('./routes/kundaliRoutes');
const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
const horoscopeRoutes = require('./routes/horoscopeRoutes');
const nakshatraRoutes = require('./routes/nakshtraRoutes');
const blogRoutes = require('./routes/blogRoutes');
const birthchartRoutes = require('./routes/birthChartRoutes');
const monthlySalesRoutes = require('./routes/monthlySalesRoutes');
const eventRoutes = require('./routes/eventRoutes');
const yearlyEventRoutes = require('./routes/yearlyEventRoutes');
const chatRoutes = require('./routes/chatRoutes'); // Import your chat routes
const adminRoutes = require('./routes/adminRoutes'); 
const sessionRoutes = require('./routes/sessionRoutes');
const app = express();

// Create an HTTP server to work with Socket.io
const server = http.createServer(app);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());
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
// app.use('/user', userRoutes);
app.use('/horoscope', horoscopeRoutes);
app.use('/birthChart', birthchartRoutes);
app.use('/nakshtra', nakshatraRoutes);
app.use('/offers', require('./routes/offersRoutes'));
app.use('/services', require('./routes/servicesRoutes'));
app.use('/products', require('./routes/productsRoutes'));
app.use('/monthly-sales', monthlySalesRoutes);
app.use('/event', eventRoutes);
app.use('/yearlyevent', yearlyEventRoutes);
const consultantRoutes = require('./routes/consultantRoutes');
// Chat routes
app.use('/chat', chatRoutes);


//admin route
app.use('/admins', adminRoutes)

// consultantRoutes
app.use('/consultants', consultantRoutes);


// session routes

app.use('/sessions', sessionRoutes)


app.get("/",(req,res) =>{
    return res.sendFile("/public/index.html");
})

// Initialize Socket.io
initializeSocket(server);

// Start the server with both Express and Socket.io
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
