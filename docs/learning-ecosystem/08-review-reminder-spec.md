# 08. 復習リマインド 実装仕様(Phase 3 候補C)

ステータス: **実装済み**(2026-07-08)

06-phase3-spec.md の候補Cを、04/05 と同水準の実装仕様に落としたもの。
Phase 3 の中で最初に着手する項目としてオーナーと合意(2026-07-08)。

## 目的

破綻点4「公開したら終わりで忘れる」への最終対策。公開からN週間後に再読・追記を
促すことで、記事を生きた文書にしつつ間隔反復で記憶を固定する。

## 設計方針

- **新しい workflow は増やさない**。既存の `weekly-summary.yml`
  (`scripts/weekly-stats.mjs`)に「復習セクション」を追記する形で実装する。
- 対象は `content/blog/` の記事のみ(ノートは対象外。ノートは生煮えメモであり
  再読・追記を促す性質のものではないため)。
- 間隔は **1週・4週・12週** の3段階(固定値。運用しながら調整してよい)。

## 判定ロジック

週次実行(cron: 毎週日曜)である前提で、「今週がちょうどその間隔に該当する週」の
記事だけを拾う。厳密に「ちょうどN週間後」の1日だけを狙うと cron の実行タイミングの
ズレで取りこぼすため、**間隔から直近7日以内**を対象窓とする:

```
postAgeDays = 今日 - 記事の date (日数)
対象 = interval <= postAgeDays < interval + 7   (interval = 7, 28, 84)
```

これにより、各記事は各間隔につき週次実行1回でちょうど1度だけリマインド対象になる
(実行が万一スキップされない限り)。

## 実装

`scripts/weekly-stats.mjs` に以下を追加する:

```js
const REVIEW_INTERVALS = [
  { days: 7, label: '1週間' },
  { days: 28, label: '4週間' },
  { days: 84, label: '12週間' },
]

function getReviewCandidates(posts, now) {
  return REVIEW_INTERVALS.flatMap(({ days, label }) => {
    return posts
      .filter((p) => {
        if (!p.date) return false
        const ageDays = Math.floor((now - new Date(p.date)) / (1000 * 60 * 60 * 24))
        return ageDays >= days && ageDays < days + 7
      })
      .map((p) => ({ ...p, intervalLabel: label }))
  })
}
```

出力する Markdown セクション(既存の「今週の捕獲」「今月の記事」「記事化候補タグ」
に続けて追加):

```markdown
## 復習リマインド

- 📄 **記事タイトル**(公開から1週間) — 再読して1行追記しよう: https://HyuDev7.github.io/blog/slug
```

該当が無い週は「今週はありません。」と表示する(他セクションと同じ空表示規約)。

## 受け入れテスト(実装完了の定義)

1. `content/blog/` にテスト記事(date を7日前・28日前・84日前に設定)を用意し、
   `node scripts/weekly-stats.mjs` を実行して3件とも正しくリマインド対象に
   出力されることを確認する(確認後にテスト記事は削除する)
2. 対象記事が0件の週でもエラーにならず「今週はありません。」と表示される
3. `weekly-summary.yml` を `workflow_dispatch` で手動実行し、Issue本文に
   復習リマインドセクションが含まれることを確認する
4. 既存の週次サマリの他セクション(捕獲・記事・記事化候補タグ)に回帰がないこと
