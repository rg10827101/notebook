const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../pages');

exports.getHome = (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
};

exports.listPages = (req, res) => {
  fs.readdir(PAGES_DIR, (err, files) => {
    if (err) return res.status(500).send('Error reading pages directory');
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    res.json(htmlFiles);
  });
};

exports.createPage = (req, res) => {
  const { title, html } = req.body;
  const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const fileName = `${safeTitle}.html`;

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
      https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css
      <link rel="stylesheet" href="../page.css" />
  </head>
  <body>
      <div class="container mt-3">
          <p><small><em>Saved on: ${formattedDate}</em></small></p>
          <h1 style="text-transform: uppercase;">${title}</h1>
          <hr/>
          ${html}
       </body>
  </html>`;

  if (!fs.existsSync(PAGES_DIR)) {
    fs.mkdirSync(PAGES_DIR);
  }

  fs.writeFile(path.join(PAGES_DIR, fileName), fullHtml, err => {
    if (err) return res.status(500).send('Error creating page');
    res.send(`Page created successfully! <a href="/pages/${fileName}" target="_blank">View Page</a>`);
  });
};

exports.deletePage = (req, res) => {
  const pageName = req.params.pageName;
  const filePath = path.join(PAGES_DIR, pageName);

  fs.unlink(filePath, err => {
    if (err) return res.status(500).send('Error deleting page');
    res.send('Page deleted');
  });
};
