#!/usr/bin/env node
// 週次サマリの傾向コメント(AIパート・オプション)。
// AI関与の境界(docs/learning-ecosystem/01-vision.md): 傾向の言語化と
// 記事化の切り口・骨子の提案までに留め、記事本文の生成はさせない。
import fs from 'fs'

const apiKey = process.env.ANTHROPIC_API_KEY
if (!apiKey) {
  console.log('ANTHROPIC_API_KEY not set — skipping trend comment.')
  process.exit(0)
}

const notes = JSON.parse(process.env.NOTES_JSON ?? '[]')

if (notes.length === 0) {
  console.log('No notes this week — skipping trend comment.')
  process.exit(0)
}

const notesSummary = notes
  .map((n) => `- [${n.tags.join(', ')}] ${n.title}\n  ${n.content.trim().slice(0, 300)}`)
  .join('\n\n')

const model = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5'

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model,
    max_tokens: 700,
    messages: [
      {
        role: 'user',
        content: `以下は今週書いたTILノートの一覧です。これを読んで、
1. 今週の学習の傾向を1〜2段落で
2. 記事化できそうなテーマがあれば、その切り口・構成の骨子案(見出しレベルのみ、本文は書かない)を1つ

日本語で、Markdown形式、簡潔に書いてください。記事の本文そのものは絶対に書かないでください。

# 今週のノート

${notesSummary}`,
      },
    ],
  }),
})

if (!response.ok) {
  console.error(`Anthropic API error: ${response.status} ${await response.text()}`)
  process.exit(0) // graceful degradation: 失敗してもワークフロー全体は継続する
}

const data = await response.json()
const trend = data.content?.[0]?.text ?? ''

console.log(trend)

const outputPath = process.env.GITHUB_OUTPUT
if (outputPath) {
  const delimiter = 'TREND_EOF'
  fs.appendFileSync(outputPath, `trend<<${delimiter}\n${trend}\n${delimiter}\n`)
}
