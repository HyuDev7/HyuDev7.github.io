#!/usr/bin/env node
// content/blog と content/notes の全タグを集計し、Issue フォーム
// (.github/ISSUE_TEMPLATE/note.yml)のタグドロップダウンの選択肢を再生成する。
// タグの表記ゆれ対策: 既存タグは自由入力ではなくドロップダウンから選ばせる。
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

function collectTags(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .flatMap((file) => {
      const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'))
      return data.tags ?? []
    })
}

const tags = [
  ...new Set([
    ...collectTags(path.join(process.cwd(), 'content/blog')),
    ...collectTags(path.join(process.cwd(), 'content/notes')),
  ]),
].sort((a, b) => a.localeCompare(b, 'ja'))

if (tags.length === 0) {
  console.error('No tags found — refusing to generate an empty dropdown.')
  process.exit(1)
}

const options = tags.map((t) => `        - ${JSON.stringify(t)}`).join('\n')

const template = `# このファイルは scripts/update-note-template.mjs により自動生成される。
# タグの選択肢を手で編集しないこと(次回の同期で上書きされる)。
name: "📝 Note"
description: "TILノートを投稿する(学習中の生メモ。整形不要)"
title: "note: "
labels: ["note"]
body:
  - type: textarea
    id: body
    attributes:
      label: 本文
      description: "学んだことを書く。整形不要。箇条書き1行でもよい"
      placeholder: |
        今日学んだこと...
    validations:
      required: true
  - type: dropdown
    id: tags
    attributes:
      label: タグ
      description: "既存タグから選ぶ(表記ゆれ防止のため、ここにあるものは必ずここから選ぶ)"
      multiple: true
      options:
${options}
    validations:
      required: false
  - type: input
    id: new_tags
    attributes:
      label: 新規タグ
      description: "上の選択肢に無いタグだけ、カンマ区切りで(例: GraphQL, gRPC)"
      placeholder: "GraphQL, gRPC"
    validations:
      required: false
  - type: input
    id: source
    attributes:
      label: 出典
      description: "書籍名・URL・動画名など(任意)"
      placeholder: "書籍: Kotlin in Action 2nd"
    validations:
      required: false
`

const templatePath = path.join(process.cwd(), '.github/ISSUE_TEMPLATE/note.yml')
const current = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf-8') : ''

if (current === template) {
  console.log('note.yml is up to date.')
} else {
  fs.writeFileSync(templatePath, template)
  console.log(`Updated note.yml with ${tags.length} tags: ${tags.join(', ')}`)
}
