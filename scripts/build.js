const fs = require('fs');
const path = require('path');

// Simple build script: copies files to ./dist excluding node_modules and dist itself
// Usage: node scripts/build.js      -> creates/overwrites dist/
//        node scripts/build.js --clean -> removes dist/

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function removeDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) {
      // skip common VCS, build and dependency artifacts and README files
      const lower = entry.toLowerCase();
      if (
        entry === 'node_modules' ||
        entry === 'dist' ||
        entry === '.git' ||
        entry === '.gitignore' ||
        lower === 'readme.md'
      ) continue;
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      copyRecursive(srcPath, destPath);
    }
  } else if (stats.isFile()) {
    fs.copyFileSync(src, dest);
  }
}

const args = process.argv.slice(2);
if (args.includes('--clean')) {
  console.log('Removing dist/ ...');
  removeDir(dist);
  console.log('dist/ removed');
  process.exit(0);
}

console.log('Building into dist/ ...');
removeDir(dist);
ensureDir(dist);

// Copy root folder contents except node_modules and dist
for (const entry of fs.readdirSync(root)) {
  const lower = entry.toLowerCase();
  // skip node_modules, dist, vcs metadata and README/gitignore files at repo root
  if (
    entry === 'node_modules' ||
    entry === 'dist' ||
    entry === '.git' ||
    entry === '.gitignore' ||
    lower === 'readme.md'
  ) continue;
  const srcPath = path.join(root, entry);
  const destPath = path.join(dist, entry);
  copyRecursive(srcPath, destPath);
}

console.log('Build complete.');

// Bundle + minify server.js into single file using esbuild (if available)
try {
  const esbuild = require('esbuild');
  const serverEntry = path.join(root, 'server.js');
  if (fs.existsSync(serverEntry)) {
    console.log('Bundling server.js with esbuild...');
    esbuild.buildSync({
      entryPoints: [serverEntry],
      outfile: path.join(dist, 'server.js'),
      bundle: true,
      platform: 'node',
      target: ['node16'],
      minify: true,
      sourcemap: false
    });
    console.log('Bundled dist/server.js');
  } else {
    console.log('No server.js found to bundle.');
  }
} catch (err) {
  console.log('esbuild not available or failed to run — skipping bundle step.');
}
