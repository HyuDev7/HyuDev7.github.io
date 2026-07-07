# 05. Phase 2 実装仕様 — 週次ループ(可視化と外圧)

ステータス: **未実装**(Phase 1 稼働後、実ノートが溜まり始めてから着手する)

着手時の注意: 実データ(実際のノートの溜まり方)を見て、本仕様の閾値・見せ方を
調整してよい。調整したら本ファイルと Decision Log を更新すること。

## 1. `/learning` 学習ダッシュボード

### 目的

タグ単位のパイプライン在庫(ノート◯件 → 記事◯件)を常時可視化し、
「このテーマ、そろそろ記事にできる」を自分で気づける状態にする。
対外的には「継続的に学んでいる証明」としてポートフォリオの一部を兼ねる。

### データソースと集計(すべてビルド時計算。Static Export の制約に注意)

- `src/lib/learning.ts` を新規作成。`getAllPostMetas()`(既存)と `getAllNoteMetas()`
  (Phase 1)を突き合わせ、タグごとに集計する:

```ts
interface TopicPipeline {
  tag: string
  noteCount: number        // このタグのノート数
  postCount: number        // このタグの記事数
  lastActivity: string     // ノート・記事の最新date
  promotable: boolean      // 昇格候補か(下記ルール)
}
```

- **昇格候補ルール(初期値)**: `noteCount >= 3 && postCount === 0`、または
  「最後の記事より後にノートが3件以上」。運用しながら調整する。

### ページ構成(`src/pages/learning/index.tsx`)

1. **ヘッダー**: 学習サイクルの説明を一言(「捕獲 → 消化 → 公開」の図解程度)
2. **サマリ数値**: 総ノート数 / 総記事数 / 今月のノート数・記事数
3. **タグ別パイプライン一覧**: `TopicPipeline` を lastActivity 降順で表示。
   昇格候補のタグには視覚的なバッジ(例: `📝 記事化候補`)を付ける
4. **直近の活動**: ノート+記事を混ぜた時系列リスト(直近10件程度)

ナビ: Header の `navLinks` に `{ href: '/learning', label: 'Learning' }` を追加。

## 2. 週次サマリ Action

### 目的

週1回、在庫状況を Issue として突きつける(外圧の自動化)。
Issue はスマホの GitHub アプリに通知される = 捕獲と同じ場所で受け取れる。

### 構成: 統計(スクリプト) + 傾向コメント(AI)の二段

`.github/workflows/weekly-summary.yml` を新規作成:

- トリガー: `schedule`(cron)。初期値は日曜 21:00 JST(`0 12 * * 0` UTC)+ `workflow_dispatch`
- Step 1 **統計(決定的・AI不要)**: `scripts/weekly-stats.mjs` を実行。
  `content/notes/` と `content/blog/` の frontmatter を読み、以下を Markdown で出力:
  - 今週(過去7日)のノート件数とタグ内訳、各ノートへのリンク
  - 今月の記事件数(月1〜2本ペースに対する現在地)
  - 昇格候補タグ(/learning と同じルールを共有。ロジックはスクリプト側に置き、
    可能なら learning.ts と判定条件を一致させる)
- Step 2 **傾向コメント(AI・オプション)**: `ANTHROPIC_API_KEY` シークレットが
  設定されている場合のみ実行。今週のノートの タイトル+本文 を渡し、
  「今週の学習の傾向」と「昇格候補タグの記事化の切り口の提案(骨子レベル)」を
  2〜3段落で生成させる。
  - **キー未設定でもStep 1だけで正常完了すること(graceful degradation。必須要件)**
  - AI関与の境界(01-vision.md): 切り口・骨子の提案まで。本文生成はさせない
- Step 3 **起票**: Step 1 + Step 2 を結合し、タイトル
  `📊 Weekly Learning Summary (YYYY-MM-DD)`、ラベル `weekly-summary` で Issue を作成

### 運用ノート

- サマリ Issue は読んだら手動で close する(閉じる行為が「今週を振り返った」チェックになる)
- 未closeのサマリが溜まる場合は読まれていないシグナル。曜日・時刻・内容量を見直す

## 3. 受け入れテスト(実装完了の定義)

1. `npm run build` が通り、/learning が実データで正しい集計を表示する
2. ノート0件のタグ・記事0件のタグでも表示が壊れない
3. `workflow_dispatch` で weekly-summary を手動実行 → 統計 Issue が起票される
4. `ANTHROPIC_API_KEY` を外して実行しても統計のみの Issue が起票される(エラーにならない)
5. 昇格候補判定が /learning と週次サマリで一致する
