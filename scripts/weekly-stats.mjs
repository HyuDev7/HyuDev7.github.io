#!/usr/bin/env node
// 週次サマリの統計パート(決定的・AI不要)。src/lib/learning.ts の
// promotable 判定ロジックと一致させること(仕様: 05-phase2-spec.md)。
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

function readMarkdownDir(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title ?? '',
        date: data.date ?? '',
        tags: data.tags ?? [],
        content,
      }
    })
}

const notesDir = path.join(process.cwd(), 'content/notes')
const postsDir = path.join(process.cwd(), 'content/blog')

const notes = readMarkdownDir(notesDir)
const posts = readMarkdownDir(postsDir)

const now = new Date()
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
const isoSevenDaysAgo = sevenDaysAgo.toISOString().slice(0, 10)

const notesThisWeek = notes.filter((n) => n.date >= isoSevenDaysAgo).sort((a, b) => (a.date < b.date ? 1 : -1))
const postsThisMonth = posts.filter((p) => {
  if (!p.date) return false
  const [y, m] = p.date.split('-').map(Number)
  return y === now.getFullYear() && m === now.getMonth() + 1
})

function computePromotableTags(posts, notes) {
  const allTags = new Set([...posts.flatMap((p) => p.tags), ...notes.flatMap((n) => n.tags)])
  const promotable = []

  for (const tag of allTags) {
    const tagPosts = posts.filter((p) => p.tags.includes(tag))
    const tagNotes = notes.filter((n) => n.tags.includes(tag))
    const lastPostDate = tagPosts.reduce((max, p) => (p.date > max ? p.date : max), '')
    const notesSinceLastPost = lastPostDate ? tagNotes.filter((n) => n.date > lastPostDate) : tagNotes

    const isPromotable =
      (tagPosts.length === 0 && tagNotes.length >= 3) ||
      (tagPosts.length > 0 && notesSinceLastPost.length >= 3)

    if (isPromotable) {
      promotable.push({ tag, noteCount: tagNotes.length, postCount: tagPosts.length })
    }
  }

  return promotable
}

const promotableTags = computePromotableTags(posts, notes)

const tagCounts = {}
for (const n of notesThisWeek) {
  for (const t of n.tags) {
    tagCounts[t] = (tagCounts[t] ?? 0) + 1
  }
}

const lines = []
lines.push(`## 今週の捕獲 (${isoSevenDaysAgo} 〜)`)
lines.push('')
lines.push(`- ノート: ${notesThisWeek.length} 件`)
if (Object.keys(tagCounts).length > 0) {
  lines.push(
    `- タグ内訳: ${Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => `${tag}(${count})`)
      .join(' / ')}`
  )
}
for (const n of notesThisWeek) {
  lines.push(`  - [${n.title}](https://HyuDev7.github.io/notes/${n.slug})`)
}
lines.push('')
lines.push(`## 今月の記事`)
lines.push('')
lines.push(`- ${postsThisMonth.length} 本(目安: 月1〜2本)`)
for (const p of postsThisMonth) {
  lines.push(`  - [${p.title}](https://HyuDev7.github.io/blog/${p.slug})`)
}
lines.push('')
lines.push(`## 記事化候補タグ`)
lines.push('')
if (promotableTags.length > 0) {
  for (const t of promotableTags) {
    lines.push(`- **${t.tag}**(ノート ${t.noteCount} / 記事 ${t.postCount})`)
  }
} else {
  lines.push('- 今週はまだありません。')
}

const statsMarkdown = lines.join('\n')

console.log(statsMarkdown)

const outputPath = process.env.GITHUB_OUTPUT
if (outputPath) {
  const delimiter = 'STATS_EOF'
  fs.appendFileSync(outputPath, `stats<<${delimiter}\n${statsMarkdown}\n${delimiter}\n`)
  fs.appendFileSync(
    outputPath,
    `notes_json<<NOTES_EOF\n${JSON.stringify(notesThisWeek.map((n) => ({ title: n.title, tags: n.tags, content: n.content })))}\nNOTES_EOF\n`
  )
}
