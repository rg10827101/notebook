const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 9999;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Routes
const pageRoutes = require('./routes/route');
app.use('/', pageRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
