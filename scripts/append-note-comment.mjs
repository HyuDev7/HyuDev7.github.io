#!/usr/bin/env node
// note-append.yml から呼び出される。Issue コメントを既存ノートの末尾に追記する。
import fs from 'fs'
import path from 'path'

const slug = process.env.NOTE_SLUG
const commentBody = process.env.COMMENT_BODY ?? ''

if (!slug) {
  console.error('NOTE_SLUG is not set')
  process.exit(1)
}

const filePath = path.join(process.cwd(), 'content/notes', `${slug}.md`)
if (!fs.existsSync(filePath)) {
  console.error(`Note file not found: ${filePath}`)
  process.exit(1)
}

const date = new Date().toISOString().slice(0, 10)
const addition = `\n\n## 追記 (${date})\n\n${commentBody.trim()}\n`

fs.appendFileSync(filePath, addition)
console.log(`Appended to ${filePath}`)
