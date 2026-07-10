#!/usr/bin/env node
// article-publish.yml から呼び出される。下書きIssueの本文を content/blog/*.md に変換する。
// オーナー限定・/publishコメント等のガードは workflow 側の条件で行う。
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const issueTitle = process.env.ISSUE_TITLE ?? ''
const issueBody = process.env.ISSUE_BODY ?? ''
const issueNumber = process.env.ISSUE_NUMBER ?? '0'

function extractSection(body, heading) {
  const re = new RegExp(`###\\s*${heading}\\s*\\n+([\\s\\S]*?)(?=\\n###\\s|$)`)
  const match = body.match(re)
  if (!match) return null
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

// フォームの接頭辞のほか、素の下書きIssueで使われがちな "draft:" も剥がす
// (剥がさないと接頭辞だけがslugに残り draft.md のような名前になる)
const title = issueTitle.replace(/^(article|draft):\s*/i, '').trim() || `Article #${issueNumber}`

// フォーム経由なら「### 本文」セクションがある。素の下書きIssue(見出し無し)は
// Issue本文全体を記事本文として扱う(後からラベルを付けて/publishするケースの救済)。
const bodySection = extractSection(issueBody, '本文')
const body = bodySection !== null ? bodySection : issueBody.trim()

if (!body) {
  console.error('記事本文が空です。')
  process.exit(1)
}

const tags = [
  ...new Set(
    [extractSection(issueBody, 'タグ') ?? '', extractSection(issueBody, '新規タグ') ?? '']
      .join(',')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  ),
]
const summary = extractSection(issueBody, '要約') ?? ''

const date = new Date().toISOString().slice(0, 10)
const titleSlugPart = slugify(title)
const baseSlug = titleSlugPart.length >= 3 ? titleSlugPart : `article-${issueNumber}`

const blogDir = path.join(process.cwd(), 'content/blog')
fs.mkdirSync(blogDir, { recursive: true })

let slug = baseSlug
let suffix = 2
while (fs.existsSync(path.join(blogDir, `${slug}.md`))) {
  slug = `${baseSlug}-${suffix}`
  suffix += 1
}

const fileContent = matter.stringify(`\n${body}\n`, {
  title,
  date,
  tags,
  summary,
  thumbnail: '',
})
const filePath = path.join(blogDir, `${slug}.md`)
fs.writeFileSync(filePath, fileContent)

const outputPath = process.env.GITHUB_OUTPUT
if (outputPath) {
  fs.appendFileSync(outputPath, `slug=${slug}\n`)
  fs.appendFileSync(outputPath, `path=content/blog/${slug}.md\n`)
}

console.log(`Created ${filePath}`)
