/**
 * Script to generate a sitemap.xml file
 * Run this script during the build process with: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://gravitas-explorer.vercel.app';
const PUBLIC_DIR = path.join(__dirname, '../public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Get current date in yyyy-MM-dd format
const getFormattedDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Generate sitemap content
const generateSitemap = () => {
  const today = getFormattedDate();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  return sitemap;
};

// Write the sitemap to the public directory
const writeSitemap = (sitemap) => {
  try {
    fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');
    console.log(`✅ Sitemap successfully generated at ${SITEMAP_PATH}`);
  } catch (error) {
    console.error(`❌ Error writing sitemap: ${error.message}`);
    process.exit(1);
  }
};

// Main function
const main = () => {
  console.log('Generating sitemap...');
  const sitemap = generateSitemap();
  writeSitemap(sitemap);
};

// Run the script
main();
