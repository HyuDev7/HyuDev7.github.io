#!/usr/bin/env node
// Usage: npm run digest -- <tag>
// 指定タグのノートを時系列に1ファイルへまとめ、記事執筆(消化)の素材にする。
// 出力先の digests/ は gitignore 済みの作業領域(公開されない)。
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const tag = process.argv.slice(2).join(' ').trim()
if (!tag) {
  console.error('Usage: npm run digest -- <tag>')
  process.exit(1)
}

function readMarkdownDir(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'))
      return {
        slug,
        title: data.title ?? '',
        date: data.date ?? '',
        tags: data.tags ?? [],
        source: data.source ?? '',
        content: content.trim(),
      }
    })
}

const notes = readMarkdownDir(path.join(process.cwd(), 'content/notes'))
  .filter((n) => n.tags.includes(tag))
  .sort((a, b) => (a.date > b.date ? 1 : -1)) // 学んだ順(昇順)に並べる

const posts = readMarkdownDir(path.join(process.cwd(), 'content/blog')).filter((p) =>
  p.tags.includes(tag)
)

if (notes.length === 0) {
  const allTags = [
    ...new Set(readMarkdownDir(path.join(process.cwd(), 'content/notes')).flatMap((n) => n.tags)),
  ].sort()
  console.error(`タグ "${tag}" のノートはありません。存在するタグ: ${allTags.join(', ')}`)
  process.exit(1)
}

const lines = []
lines.push(`# 消化素材: ${tag}`)
lines.push('')
lines.push(`ノート ${notes.length} 件 / 既存記事 ${posts.length} 本 — 生成: ${new Date().toISOString().slice(0, 10)}`)
lines.push('')
if (posts.length > 0) {
  lines.push('## このタグの既存記事(重複を避ける参考)')
  lines.push('')
  for (const p of posts) {
    lines.push(`- ${p.title}(${p.date}) — https://HyuDev7.github.io/blog/${p.slug}`)
  }
  lines.push('')
}
lines.push('## ノート(学んだ順)')
lines.push('')
for (const n of notes) {
  lines.push(`### ${n.date} — ${n.title}`)
  if (n.source) lines.push(`> 出典: ${n.source}`)
  lines.push('')
  lines.push(n.content)
  lines.push('')
  lines.push('---')
  lines.push('')
}
lines.push('## 消化チェック(骨子を考えるための問い)')
lines.push('')
lines.push('- このノート群を貫くテーマを一言で言うと?')
lines.push('- 学ぶ前の自分が誤解していたことは?')
lines.push('- 一番ハマった・意外だったことは?')
lines.push('- 読者は誰で、何を持ち帰ってほしい?')
lines.push('')
lines.push('> 骨子の壁打ちにAIを使ってよいが、本文は自分で書くこと(01-vision.md)。')

const digestsDir = path.join(process.cwd(), 'digests')
fs.mkdirSync(digestsDir, { recursive: true })
const safeName = tag.replace(/[/\\:*?"<>|]/g, '-')
const outPath = path.join(digestsDir, `${safeName}.md`)
fs.writeFileSync(outPath, lines.join('\n'))

console.log(`Created ${outPath}`)
console.log(`(digests/ は gitignore 済み。読み終えたら消してよい)`)
