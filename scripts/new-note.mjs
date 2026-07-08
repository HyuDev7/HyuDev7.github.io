#!/usr/bin/env node
// Usage: npm run new:note -- "タイトル"
import fs from 'fs'
import path from 'path'

const title = process.argv.slice(2).join(' ').trim()
if (!title) {
  console.error('Usage: npm run new:note -- "タイトル"')
  process.exit(1)
}

const date = new Date().toISOString().slice(0, 10)
const slugPart = title
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const notesDir = path.join(process.cwd(), 'content/notes')
fs.mkdirSync(notesDir, { recursive: true })

let slug = `${date}-${slugPart || 'note'}`
let suffix = 2
while (fs.existsSync(path.join(notesDir, `${slug}.md`))) {
  slug = `${date}-${slugPart || 'note'}-${suffix}`
  suffix += 1
}

const filePath = path.join(notesDir, `${slug}.md`)
const content = `---
title: "${title}"
date: "${date}"
tags: []
source: ""
---

`

fs.writeFileSync(filePath, content)
console.log(`Created ${filePath}`)
