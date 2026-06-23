#!/usr/bin/env node
/**
 * Creates the data/ directory and default JSON files if they don't exist.
 * Run after cloning the repo so the app works locally without committing data files.
 * Safe to run multiple times: only writes when a file is missing.
 * Skips entirely on Vercel (VERCEL=1) — production uses Blob, not data/*.json.
 *
 * Usage: node scripts/seed-data.js   OR   npm run seed
 */

if (process.env.VERCEL === '1') {
  process.exit(0)
}

const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(PROJECT_ROOT, 'data')

const DEFAULTS = {
  'homepage.json': {
    id: 1,
    title: 'My Site',
    body: '',
    heroComponentId: 0,
    sectionData: '',
    content_blocks: []
  },
  'components.json': [
    {"id":1,"slug":"hero","type":"hero","label":"Hero Section"},
    {"id":2,"slug":"featured","type":"featured","label":"Featured Section"},
    {"id":3,"slug":"cta","type":"cta","label":"CTA Section"},
    {"id":4,"slug":"pricing","type":"pricing","label":"Pricing Section"},
    {"id":5,"slug":"stats","type":"stats","label":"Stats"},
    {"id":6,"slug":"testimonials","type":"testimonials","label":"Testimonials"},
    {"id":7,"slug":"team","type":"team","label":"Team Section"},
    {"id":8,"slug":"faqs","type":"faqs","label":"FAQs"},
    {"id":9,"slug":"banners","type":"banners","label":"Banner"},
    {"id":10,"slug":"twocolumn","type":"twocolumn","label":"Two Column"}
  ],
  'pages-data.json': [],
  'posts.json': [],
  'settings.json': {
    siteTitle: 'My Site',
    tagline: '',
    logoUrl: '',
    announcementText: '',
    announcementUrl: '',
    header: { showLogo: true, showNav: true, customHtml: '' },
    footer: {
      text: '',
      showCopyright: true,
      copyrightText: '© {year} All rights reserved.'
    },
    navigation: {
      items: [
        { label: 'Home', url: '/' },
        { label: 'Pages', url: '/pages' },
        { label: 'Posts', url: '/posts' }
      ]
    }
  },
  'media.json': []
}

function seed() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    console.log('Created data/ directory')
  }

  let created = 0
  for (const [file, content] of Object.entries(DEFAULTS)) {
    const filePath = path.join(DATA_DIR, file)
    if (!fs.existsSync(filePath)) {
      const json = JSON.stringify(content, null, 2)
      fs.writeFileSync(filePath, json + '\n', 'utf-8')
      console.log('Created data/' + file)
      created++
    }
  }

  if (created === 0) {
    console.log('All data files already exist. Nothing to do.')
  } else {
    console.log('Done. Created', created, 'file(s). You can run npm run dev to start the app.')
  }
}

seed()
