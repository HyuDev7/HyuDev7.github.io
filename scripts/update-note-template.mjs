#!/usr/bin/env node
// content/blog と content/notes の全タグを集計し、Issue フォーム
// (.github/ISSUE_TEMPLATE/note.yml と article.yml)のタグドロップダウンの
// 選択肢を再生成する。
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

const tagFields = `  - type: dropdown
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
      required: false`

const noteTemplate = `# このファイルは scripts/update-note-template.mjs により自動生成される。
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
${tagFields}
  - type: input
    id: source
    attributes:
      label: 出典
      description: "書籍名・URL・動画名など(任意)"
      placeholder: "書籍: Kotlin in Action 2nd"
    validations:
      required: false
`

const articleTemplate = `# このファイルは scripts/update-note-template.mjs により自動生成される。
# タグの選択肢を手で編集しないこと(次回の同期で上書きされる)。
name: "✍️ Article"
description: "記事の下書きを始める(Issueが下書き帳になる。書き上がったら /publish コメントで公開)"
title: "article: "
labels: ["article"]
body:
  - type: markdown
    attributes:
      value: |
        この Issue は**下書き帳**です。投稿後も本文を何度でも編集できます。
        書き上がったら \`/publish\` とコメントすると記事として公開されます。
        本文は自分で書くこと(AIに書かせない — 執筆が定着プロセスそのもの)。
  - type: textarea
    id: body
    attributes:
      label: 本文
      description: "記事本文(Markdown)。あとから何度でも編集できるので途中まででもよい"
    validations:
      required: true
  - type: input
    id: summary
    attributes:
      label: 要約
      description: "記事一覧に表示される一行要約(公開までに書けばよい)"
    validations:
      required: false
${tagFields}
`

function writeIfChanged(filePath, content, label) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''
  if (current === content) {
    console.log(`${label} is up to date.`)
  } else {
    fs.writeFileSync(filePath, content)
    console.log(`Updated ${label} with ${tags.length} tags: ${tags.join(', ')}`)
  }
}

const templateDir = path.join(process.cwd(), '.github/ISSUE_TEMPLATE')
writeIfChanged(path.join(templateDir, 'note.yml'), noteTemplate, 'note.yml')
writeIfChanged(path.join(templateDir, 'article.yml'), articleTemplate, 'article.yml')
