# GitHub Pages 個人サイト 設計書

## 概要

| 項目 | 内容 |
|------|------|
| 目的 | ポートフォリオ + 技術ブログ |
| デザイン | カラフル・クリエイティブ |
| 技術スタック | Next.js (Static Export) |
| ホスティング | GitHub Pages |
| URL | `https://<username>.github.io` |

---

## サイト構成（ページ一覧）

```
/               → トップページ（Hero + 自己紹介 + ピックアップ）
/about          → 詳細プロフィール・スキルセット
/projects       → プロジェクト一覧
/projects/[id]  → プロジェクト詳細
/blog           → ブログ記事一覧
/blog/[slug]    → ブログ記事詳細
/contact        → 連絡先
```

---

## ページ詳細設計

### `/` トップページ

**セクション構成**
1. **Hero** — キャッチコピー + アニメーション背景（グラデーション / パーティクル）
2. **About（スニペット）** — 一言自己紹介 + アバター画像 → `/about` へのリンク
3. **Featured Projects** — 代表的なプロジェクト 2〜3件のカードグリッド
4. **Recent Blog Posts** — 最新記事 3件のリスト
5. **Contact CTA** — SNS / メールへの誘導

---

### `/about` プロフィール

**コンテンツ**
- 自己紹介文（Markdown で管理）
- スキルマップ（言語・フレームワーク・ツールをタグ or バーで表示）
- 経歴タイムライン
- 使用ツール / 好きな技術スタック

---

### `/projects` プロジェクト一覧

**コンテンツ管理方法**  
`/content/projects/*.json` にデータを置き、`getStaticProps` で読み込む（外部 API 不要）

**各プロジェクトのデータ構造**
```json
{
  "id": "kabuki",
  "title": "Kabuki",
  "description": "Multi-agent orchestration system using Claude Code",
  "tags": ["Kotlin", "Claude", "Zellij"],
  "thumbnail": "/images/projects/kabuki.png",
  "github": "https://github.com/...",
  "demo": null,
  "featured": true
}
```

**UI**  
カラフルなカードグリッド（タグでフィルタリング可能）

---

### `/blog` ブログ

**記事管理方法**  
`/content/blog/*.md` に Markdown + Frontmatter で記事を管理し、`gray-matter` + `next-mdx-remote` でレンダリング

**Frontmatter 例**
```markdown
---
title: "Docker入門：Jibで始めるコンテナ化"
date: "2025-01-15"
tags: ["Docker", "Kotlin", "CI/CD"]
summary: "KotlinアプリをJibでコンテナ化する手順を解説"
thumbnail: "/images/blog/docker-jib.png"
---
```

**UI**  
- 一覧：タグフィルター + 日付ソート + 検索（クライアントサイド）
- 詳細：シンタックスハイライト（`rehype-highlight`）、目次（TOC）自動生成

---

### `/contact` 連絡先

- GitHub / Twitter(X) / LinkedIn などの SNS リンク
- メールフォーム（静的サイトのため [Formspree](https://formspree.io/) を利用）

---

## 技術スタック詳細

### コア

| ライブラリ | 用途 |
|-----------|------|
| `next` | フレームワーク（Static Export） |
| `react` | UI |
| `typescript` | 型安全 |

### スタイリング

| ライブラリ | 用途 |
|-----------|------|
| `tailwindcss` | ユーティリティ CSS |
| `framer-motion` | アニメーション |
| `@radix-ui/react-*` | アクセシブルなUIコンポーネント |

### コンテンツ

| ライブラリ | 用途 |
|-----------|------|
| `gray-matter` | Markdown Frontmatter パース |
| `next-mdx-remote` | MDX レンダリング |
| `rehype-highlight` | コードハイライト |
| `rehype-slug` | 見出し ID 付与（TOC用） |

### デプロイ

| ツール | 用途 |
|-------|------|
| `GitHub Actions` | CI/CD |
| `GitHub Pages` | ホスティング |

---

## ディレクトリ構成

```
my-portfolio/
├── content/
│   ├── blog/
│   │   ├── docker-intro.md
│   │   └── kotlin-coroutines.md
│   └── projects/
│       ├── kabuki.json
│       └── ...
├── public/
│   └── images/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── ui/          ← 汎用コンポーネント
│   │   ├── blog/
│   │   └── projects/
│   ├── lib/
│   │   ├── posts.ts     ← Markdown読み込みユーティリティ
│   │   └── projects.ts
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── about.tsx
│   │   ├── projects/
│   │   ├── blog/
│   │   └── contact.tsx
│   └── styles/
│       └── globals.css
├── next.config.js       ← output: 'export' を設定
├── tailwind.config.js
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## デザインシステム

### カラーパレット（カラフル路線）

```
Primary:   #6C63FF  （紫）
Secondary: #FF6584  （ピンク）
Accent:    #43E6FC  （シアン）
Success:   #43FCAA  （グリーン）
Background: #0F0F1A （ダークネイビー）
Surface:   #1A1A2E  （カード背景）
Text:      #E8E8F0  （メインテキスト）
```

> ダークベース + 鮮やかなアクセントカラーで「テック×クリエイティブ」感を演出

### タイポグラフィ

| 用途 | フォント |
|------|---------|
| 見出し | `Space Grotesk` (Google Fonts) |
| 本文 | `Inter` |
| コード | `JetBrains Mono` |

### アニメーション方針

- ページ遷移：`framer-motion` の `AnimatePresence`
- Hero：グラジエントメッシュ背景 or CSS アニメーション
- カード：ホバー時のリフト + グロー効果
- スクロール：`IntersectionObserver` でフェードイン

---

## GitHub Actions デプロイ設定

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build   # next build → out/ が生成される

      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

**`next.config.js` の設定**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '',          // カスタムドメインなしの場合は不要
  images: {
    unoptimized: true,   // 静的エクスポート時は必須
  },
}

module.exports = nextConfig
```

---

## 実装フェーズ

### Phase 1 — 基盤構築（1〜2日）
- [ ] Next.js プロジェクト作成 + TypeScript + Tailwind セットアップ
- [ ] `next.config.js` に `output: 'export'` 設定
- [ ] Layout / Header / Footer コンポーネント
- [ ] GitHub Actions ワークフロー作成・動作確認

### Phase 2 — コンテンツページ（2〜3日）
- [ ] トップページ（Hero + 各セクション）
- [ ] About ページ
- [ ] Projects 一覧 + JSON データ投入
- [ ] Contact ページ（Formspree 連携）

### Phase 3 — ブログ機能（2〜3日）
- [ ] Markdown → ページ変換（`getStaticPaths` + `getStaticProps`）
- [ ] シンタックスハイライト
- [ ] TOC（目次）自動生成
- [ ] タグフィルター
- [ ] 記事を 1〜2 本書いて動作確認

### Phase 4 — 仕上げ（1〜2日）
- [ ] framer-motion でアニメーション追加
- [ ] OGP / SEO 対応（`next/head`）
- [ ] レスポンシブ対応確認
- [ ] Lighthouse でパフォーマンスチェック
- [ ] カスタムドメイン設定（任意）

---

## SEO / OGP 対応

各ページで `<Head>` に以下を設定：

```tsx
<Head>
  <title>{title} | Hugh's Portfolio</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</Head>
```

---

## 参考リンク

- [Next.js Static Export 公式ドキュメント](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages + Next.js デプロイ](https://github.com/peaceiris/actions-gh-pages)
- [Formspree（静的サイト用フォーム）](https://formspree.io/)
- [Google Fonts: Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
