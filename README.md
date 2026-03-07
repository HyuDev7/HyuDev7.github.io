# HyuDev7.github.io

My personal portfolio & tech blog — built with Next.js Static Export and hosted on GitHub Pages.

🌐 **[https://HyuDev7.github.io](https://HyuDev7.github.io)**

---

## ✨ Features

- **Portfolio** — プロジェクト一覧・詳細ページ（タグフィルター付き）
- **Blog** — Markdown で記事管理、シンタックスハイライト・TOC・タグ検索
- **About** — スキルマップ・経歴タイムライン
- **Contact** — SNS リンク + Formspree メールフォーム
- **Animations** — framer-motion によるページ遷移・スクロールアニメーション
- **SEO / OGP** — canonical URL・Twitter Card・og:image 対応
- **CI/CD** — main push で GitHub Actions が自動ビルド・デプロイ

---

## 🛠 Tech Stack

| カテゴリ | ライブラリ |
|---------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (Pages Router / Static Export) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | framer-motion |
| Blog | gray-matter + next-mdx-remote + rehype-highlight + rehype-slug |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## 🚀 Getting Started

```bash
git clone https://github.com/HyuDev7/HyuDev7.github.io.git
cd HyuDev7.github.io

npm install
npm run dev
```

`http://localhost:3000` で確認できます。

---

## ✍️ コンテンツの追加

### ブログ記事

`content/blog/` に Markdown ファイルを追加するだけです。

```bash
touch content/blog/my-new-post.md
```

Frontmatter の形式：

```markdown
---
title: "記事タイトル"
date: "2025-03-01"
tags: ["Kotlin", "Docker"]
summary: "記事の一行要約"
thumbnail: "/images/blog/my-new-post.png"
---

## 本文

ここから Markdown で書く。
```

### プロジェクト

`content/projects/` に JSON ファイルを追加します。

```json
{
  "id": "my-project",
  "title": "My Project",
  "description": "プロジェクトの説明",
  "tags": ["Kotlin", "TypeScript"],
  "thumbnail": "/images/projects/my-project.png",
  "github": "https://github.com/HyuDev7/my-project",
  "demo": null,
  "featured": false
}
```

`"featured": true` にするとトップページの Featured Projects に表示されます。

---

## 📁 Directory Structure

```
.
├── content/
│   ├── blog/          # ブログ記事 (.md)
│   └── projects/      # プロジェクトデータ (.json)
├── public/
│   └── images/        # 画像ファイル
├── src/
│   ├── components/
│   │   ├── layout/    # Header / Footer / Layout
│   │   ├── ui/        # Tag / FadeIn など汎用コンポーネント
│   │   ├── blog/      # BlogCard
│   │   └── projects/  # ProjectCard
│   ├── lib/
│   │   ├── posts.ts   # Markdown 読み込みユーティリティ
│   │   └── projects.ts
│   ├── pages/         # Next.js ページ
│   └── styles/
│       └── globals.css
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Actions デプロイ設定
└── next.config.js     # output: 'export' 設定
```

---

## 📦 Deploy

`main` ブランチに push すると GitHub Actions が自動的に：

1. `npm ci` で依存関係をインストール
2. `npm run build` で静的ファイルを `out/` に生成
3. `out/` を `gh-pages` ブランチにデプロイ

手動でビルド結果を確認したい場合：

```bash
npm run build
# out/ ディレクトリに静的ファイルが生成される
```
