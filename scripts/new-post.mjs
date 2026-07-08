#!/usr/bin/env node
// Usage: npm run new:post -- "タイトル"
import fs from 'fs'
import path from 'path'

const title = process.argv.slice(2).join(' ').trim()
if (!title) {
  console.error('Usage: npm run new:post -- "タイトル"')
  process.exit(1)
}

const date = new Date().toISOString().slice(0, 10)
const slug = title
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'post'

const blogDir = path.join(process.cwd(), 'content/blog')
fs.mkdirSync(blogDir, { recursive: true })

const filePath = path.join(blogDir, `${slug}.md`)
if (fs.existsSync(filePath)) {
  console.error(`Already exists: ${filePath}`)
  process.exit(1)
}

const content = `---
title: "${title}"
date: "${date}"
tags: []
summary: ""
thumbnail: ""
---

<!-- 消化チェック: 自分の言葉で一言で言うと何? -->

## 背景

<!-- なぜこれを学んだか。何に困っていたか -->

## 本題

<!-- ハマったこと・意外だったことを必ず1つ書く -->

## まとめ

<!-- 参考リンク -->
`

fs.writeFileSync(filePath, content)
console.log(`Created ${filePath}`)
