# 11. スマホ記事執筆(Issue下書き → /publish) 実装仕様(Phase 1 拡張)

ステータス: **実装済み**(2026-07-10)

## 背景

捕獲(ノート)はスマホで完結するのに、記事執筆の入口は PC(`npm run new:post`)
しかなかった。「書きたい熱があるのに書き出せない」を防ぐため、スマホだけで
下書き→公開まで完結する経路を追加する。

## 設計: Issue = 下書き帳、/publish で公開

GitHub のモバイルUXで最も編集しやすいのは自分の Issue 本文(何度でも編集可)
であることを利用する。

1. 「✍️ Article」Issue フォーム(`.github/ISSUE_TEMPLATE/article.yml`)で
   下書きを開始。ラベル `article` が自動付与される
2. Issue は**開いたまま = 下書き**。何日でも本文を編集して書き進める
3. 書き上がったらオーナーが `/publish` とコメント →
   `.github/workflows/article-publish.yml` が本文を `content/blog/<slug>.md` に
   変換して commit・deploy dispatch・公開URLコメント・Issue close

**恒久ルールとの関係**: 本文は人間が書く(01-vision.md)。この仕組みは
「書く場所」をスマホに広げるだけで、書く主体は変わらない。フォーム冒頭にも
その旨を明記している。

## Issue フォーム

`article.yml` は **note.yml と同じく `scripts/update-note-template.mjs` による
自動生成**(タグドロップダウンを共有)。手で編集しないこと。

- `body`(textarea・必須): 記事本文。途中まででも投稿できる(下書きなので)
- `summary`(input・任意): 一覧表示用の一行要約。公開までに書けばよい
- `tags` / `new_tags`: note.yml と同一(10-tag-suggest-spec.md)

## 変換スクリプト(`scripts/publish-article-from-issue.mjs`)

- 「### 本文」セクションがあればそれを本文に使う
- **フォールバック**: セクション見出しが無い場合は Issue 本文全体を記事本文と
  みなす。素の Issue で書き始めた下書きにも、後から `article` ラベルを付けて
  `/publish` すれば公開できる(救済経路)
- タイトルの接頭辞 `article:` / `draft:` を剥がしてから slugify。
  日本語主体で3文字未満しか残らなければ `article-<issue番号>` にフォールバック
- 本文が空なら失敗させる
- frontmatter は既存記事スキーマ準拠(date は公開日、thumbnail は空)

## workflow のガード(セキュリティ要件・必須)

- PRコメント除外(`issue.pull_request == null`)
- ラベル `article` 必須
- コメント投稿者がリポジトリオーナー(`HyuDev7`)
- コメントが `/publish` で始まる

また、`note-append.yml` 側に「`/` 始まりのコメントは追記対象にしない」ガードを
追加した(note Issue に誤って `/publish` した場合にノートへ追記されるのを防ぐ)。

## 執筆経路は2つになる(運用ガイドに反映済み)

| 経路 | 使い分け |
|------|---------|
| PC: `npm run digest` → `npm run new:post` | 腰を据えて書くとき(従来どおり) |
| スマホ: Article Issue → `/publish` | 外出中に書きたい熱が来たとき |

## 受け入れテスト(実装完了の定義)

1. フォーム形式の Issue 本文から、本文・タグ(マージ・重複排除)・要約が
   正しい frontmatter で変換される(ローカル確認済み)
2. セクション見出しの無い素の Issue 本文でも全体が本文として変換される
   (ローカル確認済み)
3. 日本語主体タイトル・`draft:` 接頭辞で slug がフォールバックする(確認済み)
4. 本文が空だと失敗する(確認済み)
5. 実Issueで `/publish` → 記事公開・Issue close・公開URLコメント(実運用で確認する)
6. オーナー以外の `/publish` や、`article` ラベル無し Issue では発火しない
