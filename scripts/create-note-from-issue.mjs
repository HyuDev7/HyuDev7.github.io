#!/usr/bin/env node
// GitHub Issue Forms の本文を content/notes/*.md に変換する。
// note-capture.yml から呼び出される想定(Issue オーナー限定のガードは workflow 側の条件で行う)。
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const issueTitle = process.env.ISSUE_TITLE ?? ''
const issueBody = process.env.ISSUE_BODY ?? ''
const issueNumber = process.env.ISSUE_NUMBER ?? '0'

function extractSection(body, heading) {
  const re = new RegExp(`###\\s*${heading}\\s*\\n+([\\s\\S]*?)(?=\\n###\\s|$)`)
  const match = body.match(re)
  if (!match) return ''
  const value = match[1].trim()
  return value === '_No response_' ? '' : value
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const title = issueTitle.replace(/^note:\s*/i, '').trim() || `Note #${issueNumber}`
const body = extractSection(issueBody, '本文') || '(本文なし)'
// 「タグ」= 既存タグのドロップダウン(カンマ区切りで届く)、「新規タグ」= 自由入力。
// ドロップダウンの見出し「タグ」の正規表現が「新規タグ」に誤マッチしないのは、
// パターンが「### 」直後からの一致を要求するため。
const tags = [
  ...new Set(
    [extractSection(issueBody, 'タグ'), extractSection(issueBody, '新規タグ')]
      .join(',')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  ),
]
const source = extractSection(issueBody, '出典')

const date = new Date().toISOString().slice(0, 10)
// 日本語主体のタイトルはslugifyでほぼ消えて「2」のような断片だけ残ることがある。
// 3文字未満しか残らなければ意味のあるslugではないとみなし issue番号にフォールバック。
const titleSlugPart = slugify(title)
const baseSlug = `${date}-${titleSlugPart.length >= 3 ? titleSlugPart : `note-${issueNumber}`}`

const notesDir = path.join(process.cwd(), 'content/notes')
fs.mkdirSync(notesDir, { recursive: true })

let slug = baseSlug
let suffix = 2
while (fs.existsSync(path.join(notesDir, `${slug}.md`))) {
  slug = `${baseSlug}-${suffix}`
  suffix += 1
}

const fileContent = matter.stringify(body, { title, date, tags, source })
const filePath = path.join(notesDir, `${slug}.md`)
fs.writeFileSync(filePath, fileContent)

// GitHub Actions への出力(後続ステップでコミットメッセージ・コメントに使う)
const outputPath = process.env.GITHUB_OUTPUT
if (outputPath) {
  fs.appendFileSync(outputPath, `slug=${slug}\n`)
  fs.appendFileSync(outputPath, `path=content/notes/${slug}.md\n`)
}

console.log(`Created ${filePath}`)
