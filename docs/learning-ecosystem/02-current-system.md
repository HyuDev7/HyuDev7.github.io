# 02. 既存システムの現状 — 実装前に知るべき前提

2026-07-07 時点の `main` ブランチの調査結果。実装者(人間・AIエージェント)は
着手前にこのファイルで前提を確認し、**乖離があればまずこのファイルを更新する**こと。

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 15(**Pages Router / Static Export**。`next.config.js` で `output: 'export'`) |
| 言語 | TypeScript |
| スタイル | Tailwind CSS v4 が入っているが、実際のページは**ほぼインラインstyle**で書かれている |
| アニメーション | framer-motion |
| Markdown処理 | gray-matter(frontmatter)+ next-mdx-remote + remark-gfm + rehype-highlight + rehype-slug |
| ホスティング | GitHub Pages(`gh-pages` ブランチへ `out/` をデプロイ) |
| CI/CD | GitHub Actions |

**Static Export の制約(重要)**: サーバーサイド機能(API Routes、ISR、middleware)は使えない。
すべてのページはビルド時に `getStaticProps` / `getStaticPaths` で静的生成する。
動的な集計(ダッシュボード等)もすべて**ビルド時計算**になる。

## コンテンツの公開フロー(検証済み・動作している)

1. `content/blog/<slug>.md` に frontmatter 付き Markdown を置く
2. `main` に push
3. `.github/workflows/deploy.yml` が `npm ci && npm run build` → `out/` を
   `peaceiris/actions-gh-pages` で `gh-pages` ブランチへデプロイ
4. https://HyuDev7.github.io/blog/<slug> として公開される

### 記事の frontmatter スキーマ(既存)

```yaml
---
title: "記事タイトル"
date: "2025-03-01"        # YYYY-MM-DD。一覧はこの降順ソート
tags: ["Kotlin", "Docker"]
summary: "記事の一行要約"
thumbnail: "/images/blog/xxx.png"   # 省略可
---
```

## ディレクトリマップ(学習エコシステムに関係する部分)

```
content/
├── blog/              # 日本語記事 (.md)。ここを src/lib/posts.ts が走査
│   └── en/            # 英訳記事 (.md)。同slugがあると英語表示にフォールバック
└── projects/          # ポートフォリオ用JSON
src/
├── lib/
│   ├── posts.ts       # 記事読み込み。getAllPostMetas / getPostBySlug / getAllSlugs
│   ├── projects.ts
│   └── i18n.tsx       # LangProvider。'ja'|'en' を localStorage 永続化
├── pages/
│   ├── blog/index.tsx     # 記事一覧。タグフィルター+テキスト検索(クライアントサイド)
│   ├── blog/[slug].tsx    # 記事詳細。MDX描画・TOC・言語切替
│   └── (index/about/projects/contact)
└── components/
    ├── layout/Header.tsx  # navLinks 配列にナビ項目がハードコード
    └── blog/BlogCard.tsx  # 一覧カード
.github/workflows/
├── deploy.yml         # main push → ビルド → gh-pages デプロイ(動作している)
└── translate.yml      # ※下記参照。未完成
```

## 注意: translate.yml は未完成のスタブ

`translate.yml` は「`content/blog/*.md` の変更を検知して英訳し `content/blog/en/` へ
コミットする」**構想の骨組みだけ**が存在する:

- 変更ファイル検知ステップは動くが、翻訳ステップは `echo` するだけ
- 英訳ファイルをコミットするステップはコメントアウトされている
- つまり**現状、英訳は自動生成されない**。`content/blog/en/` に手で置けば
  フロント側のフォールバック表示(実装済み)は機能する

学習エコシステムのドキュメントで「英訳資産になる」と言及している箇所は、
この workflow の完成が前提。完成させる作業は本エコシステムの Phase には含めていない
(独立タスクとして扱う)。

## 実装時に流用すべき既存パターン

- **新しいコンテンツ種別の読み込み**: `src/lib/posts.ts` の構造(ディレクトリ走査 →
  gray-matter でパース → メタ型を返す)をコピーして `notes.ts` を作るのが最短。
- **一覧ページ**: `src/pages/blog/index.tsx`(タグフィルター・検索)の構造を流用。
- **詳細ページ**: `src/pages/blog/[slug].tsx`(MDX serialize、`getStaticPaths` で全slug列挙)。
- **ナビ追加**: `src/components/layout/Header.tsx` の `navLinks` 配列に1行追加。
- **デザイントークン**(インラインstyleで直書きされている):
  - 背景 `#0F0F1A` / カード `#1A1A2E` / 本文 `#C8C8D8` / 淡色 `#9999B3` / 強調 `#E8E8F0`
  - アクセント: 紫 `#6C63FF` / ピンク `#FF6584` / シアン `#43E6FC` / 緑 `#43FCAA`
  - 見出し `Space Grotesk` / 本文 `Inter` / コード・日付 `JetBrains Mono`

## 検証コマンド

```bash
npm ci          # 依存インストール
npm run dev     # http://localhost:3000
npm run build   # 静的ビルド。out/ が生成されればデプロイ可能な状態
npm run lint
```

変更を push する前に `npm run build` が通ることを必ず確認する
(ビルドが落ちると deploy.yml が失敗しサイト更新が止まる)。
