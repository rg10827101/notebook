const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 9999;

const PAGES_DIR = path.join(__dirname, 'pages');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('pages'));

// Route to show form
app.get('/list-pages', (req, res) => {
    fs.readdir(PAGES_DIR, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading pages directory');
        }

        const htmlFiles = files.filter(file => file.endsWith('.html'));
        res.json(htmlFiles);
    });

  res.sendFile(path.join(__dirname, 'index.html'));
});



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
