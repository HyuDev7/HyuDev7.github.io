# 04. Phase 1 実装仕様 — 日次ループ(捕獲)

ステータス: **未実装**(この仕様で実装に着手できる状態)

## 概要

軽量TILノート層を新設し、スマホ(GitHub Issue経由)と PC(scaffoldingスクリプト)の
2つの捕獲経路を作る。ノートは生煮えのまま即公開される。

## 1. ノートのデータ仕様

### 配置

```
content/notes/<slug>.md
```

- slug は `YYYY-MM-DD-<短い英数字タイトル>` を推奨(例: `2026-07-08-kotlin-flow-buffer`)。
  日付プレフィックスにより一覧性とslug衝突回避を兼ねる。
- `content/blog/` とは完全に独立。既存の translate.yml のパスフィルタ
  (`content/blog/*.md`)にも deploy 以外の既存 workflow にも影響しない。
  ノートは翻訳対象外(生煮えメモを翻訳する価値が薄いため)。

### frontmatter スキーマ(記事より意図的に薄い)

```yaml
---
title: "Kotlin Flow の buffer の挙動"
date: "2026-07-08"          # YYYY-MM-DD
tags: ["Kotlin"]            # 記事と同じタグ語彙を使うこと(Phase 2 のパイプライン集計がタグでJOINするため)
source: "書籍: Kotlin in Action 2nd"   # 任意。学びの出典(URL・書名・動画名など自由記述)
---

本文(Markdown)。整形不要。箇条書き1行でもよい。
```

- `summary` / `thumbnail` は**要求しない**(捕獲摩擦を上げないため)。
- **タグの語彙統一が唯一の規律**: Phase 2 の /learning がノートと記事をタグで突き合わせる。
  表記ゆれ(`kotlin` vs `Kotlin`)は集計を壊すため、既存記事のタグ表記に合わせる。

### 読み込みライブラリ

`src/lib/notes.ts` を新規作成。`src/lib/posts.ts` の構造を流用し、
`content/notes/` を走査して `NoteMeta { slug, title, date, tags, source }` を返す。
英語版・サマリ・サムネイルのロジックは持たない(posts.ts より単純になる)。

## 2. 公開ページ仕様

### `/notes` — 一覧

- `src/pages/notes/index.tsx`。`src/pages/blog/index.tsx` の構造(タグフィルター +
  テキスト検索)を流用。デザイントークンは 02-current-system.md 参照。
- ページ上部に**生煮え断り書き**を常設する(これはコンセプトの一部。01-vision.md 参照):
  > ここは学習中の生メモ置き場です。理解が浅いまま・間違いを含んだまま公開しています。
  > 消化されたものは Blog に昇格します。
- 一覧カードは BlogCard より軽量でよい(タイトル・日付・タグ。summaryは無いため)。

### `/notes/[slug]` — 詳細

- `src/pages/blog/[slug].tsx` の簡略版。MDX描画は同じプラグイン構成
  (remark-gfm / rehype-highlight / rehype-slug)。TOC・言語切替は不要。
- `source` frontmatter があれば「出典」として表示。
- 詳細ページ内にも生煮え断り書きを小さく表示。

### ナビゲーション

- `src/components/layout/Header.tsx` の `navLinks` に `{ href: '/notes', label: 'Notes' }` を
  Blog の隣に追加。

## 3. スマホ捕獲経路(Issue → ノート)— 本Phaseの心臓部

### ユーザー体験

1. スマホの GitHub アプリでこのリポジトリに Issue を立てる(Issueフォームが入力欄を提供)
2. GitHub Actions が Issue 本文をパースして `content/notes/<slug>.md` を生成し `main` へ commit
3. Action が Issue に「公開したよ」コメントを付けて close
4. 既存の deploy.yml が走り、数分でサイトに反映

### Issue フォーム

`.github/ISSUE_TEMPLATE/note.yml` を新規作成(GitHub Issue Forms 形式):

- `title`: ノートタイトル(Issueタイトルをそのまま使う)
- 入力項目: `tags`(カンマ区切りテキスト)、`source`(任意)、`body`(textarea、本文)
- 自動でラベル `note` を付与(workflow のトリガー条件になる)

> **既知の落とし穴**: Issue Forms の `labels:` フィールドは、そのラベルが
> **リポジトリに事前登録されていないと、エラーも出さず黙って付与されない**。
> 初回導入時は `note` ラベルを手動(またはAPI経由)で作成しておくこと。
> ラベルが存在しないまま Issue が作成されると、下記トリガー条件が false になり
> job が `skipped` になる(2026-07-08 に実際に発生。原因はモバイル起因ではなかった)。

### 変換 workflow

`.github/workflows/note-capture.yml` を新規作成:

- トリガー: `issues: [opened, labeled]` かつラベル `note`。
  `labeled` も含めるのは、上記の落とし穴でラベルが付かなかった Issue に対して
  手動でラベルを付け直すだけで再処理できるようにするため(`opened` のみだと
  `rerun` してもイベント発生時点のペイロードが再利用されるだけでラベル無しのまま失敗する)。
- **セキュリティ要件(必須)**: `github.event.issue.user.login == 'HyuDev7'`
  (= リポジトリオーナー)の場合のみ実行する。
  この条件が無いと、**第三者が Issue を立てるだけで本番サイトにコンテンツを注入できてしまう**。
  実装時にこのガードを絶対に省略しないこと。
- 処理:
  1. Issue フォームの構造化本文から tags / source / body を抽出
  2. slug 生成: `<YYYY-MM-DD>-<Issueタイトルのslug化>`(日本語タイトルの場合は
     `<YYYY-MM-DD>-note-<issue番号>` にフォールバック)。既存ファイルと衝突したら `-2` 等を付す
  3. frontmatter を組み立てて `content/notes/<slug>.md` を書き出し
  4. `github-actions[bot]` 名義で `main` へ commit & push
  5. **`gh workflow run deploy.yml --ref main` で deploy を明示的に dispatch する**
     (下記の落とし穴への対策。必須ステップ)
  6. Issue に公開URLをコメントして close(`state_reason: completed`)
- frontmatter への値の埋め込みは YAML エスケープに注意(タイトルに `"` や `:` が
  含まれるケース)。gray-matter で読めることが受け入れ条件。

> **既知の落とし穴その2**: デフォルトの `GITHUB_TOKEN` で行った git push は、
> 他の workflow の `on: push` トリガーを**発火させない**(無限ループ防止のための
> GitHub Actions の仕様)。そのため `note-capture.yml` が `main` に push しても
> `deploy.yml` は自動起動せず、ノートはリポジトリには入るがサイトには反映されない
> (2026-07-08 に実際に発生)。対策として `deploy.yml` に `workflow_dispatch:` を
> 追加し、`note-capture.yml` の commit 後に `gh workflow run deploy.yml --ref main`
> で明示的に dispatch する(`actions: write` 権限が必要)。API 経由の明示的な
> dispatch は無限ループ防止の対象外なので正常に動く。

### 設計上の割り切り(オーナー合意済み)

- Action は `main` に直接 commit する = **スマホから書いた瞬間に公開される**。
  生煮え公開の覚悟が前提(Decision Log 参照)。ワンクッション欲しくなったら
  「PRを作る」方式に変更できる(マージの一手間が増えるトレードオフ)。

## 4. PC捕獲経路(scaffolding)

`scripts/new-note.mjs` / `scripts/new-post.mjs` を新規作成し、package.json に登録:

```jsonc
"scripts": {
  "new:note": "node scripts/new-note.mjs",   // 例: npm run new:note -- "Kotlin Flow の buffer"
  "new:post": "node scripts/new-post.mjs"
}
```

- `new:note`: 引数のタイトルから slug を生成し、今日の日付入り frontmatter の
  `content/notes/<slug>.md` を生成して、生成パスを表示する。依存ライブラリ追加は不要
  (Node 標準の fs/path のみで書く)。
- `new:post`: 同様に `content/blog/<slug>.md` を生成する。テンプレート本文に
  **消化を促す問い**をコメントとして埋め込む(書く行為=定着プロセスの補助線):

```markdown
<!-- 消化チェック: 自分の言葉で一言で言うと何? -->
## 背景

<!-- なぜこれを学んだか。何に困っていたか -->

## 本題

<!-- ハマったこと・意外だったことを必ず1つ書く -->

## まとめ

<!-- 参考リンク -->
```

## 5. 受け入れテスト(実装完了の定義)

1. `npm run build` が通り、`out/notes/` 以下が生成される
2. `/notes` で一覧・タグフィルター・断り書きが表示される
3. `npm run new:note -- "テスト"` → 生成ファイルが build で正常に処理される
4. オーナーが Issue フォームからノート Issue を立てる → main にノートが commit され、
   Issue が close され、サイトに反映される(エンドツーエンドで1回実測する)
5. オーナー以外のアカウントで note ラベルの Issue を立てても workflow がノートを作らない
6. 既存ページ(/, /blog, /projects, /about, /contact)に見た目・挙動の回帰がない
