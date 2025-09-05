const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 9999;

const PAGES_DIR = path.join(__dirname, 'pages');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/pages', express.static(path.join(__dirname, 'pages')));




// Serve index.html on root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve list of pages as JSON
app.get('/list-pages', (req, res) => {
    fs.readdir(PAGES_DIR, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading pages directory');
        }

        const htmlFiles = files.filter(file => file.endsWith('.html'));
        res.json(htmlFiles); // ✅ Only one response
    });
});


app.post('/create-page', (req, res) => {
  const { title, html } = req.body;
  const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const fileName = `${safeTitle}.html`;

  // Get current date and time
  const now = new Date();
  const formattedDate = now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const fullHtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr"
      crossorigin="anonymous"
    />
    <link rel="stylesheet" href="../page.css" />
  </head>
  <body>
      <div class="container mt-3">
          <p><small><em>Saved on: ${formattedDate}</em></small></p>
          <h1 style="text-transform: uppercase;">${title}</h1>
          <hr/>
          ${html}
      </div>
  </body>
  </html>`;

  const outputPath = path.join(__dirname, 'pages', fileName);

  if (!fs.existsSync('pages')) {
    fs.mkdirSync('pages');
  }

  fs.writeFile(outputPath, fullHtml, (err) => {
    if (err) {
      return res.status(500).send('Error creating page');
    }

    res.send(`Page created successfully! <a href="/pages/${fileName}" target="_blank">View Page</a>`);
  });
});



app.delete('/delete-page/:pageName', (req, res) => {
    const pageName = req.params.pageName;
    const filePath = path.join(__dirname, 'pages', pageName);

    fs.unlink(filePath, err => {
        if (err) return res.status(500).send('Error deleting page');
        res.send('Page deleted');
    });
});






app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
