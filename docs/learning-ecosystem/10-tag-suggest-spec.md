# 10. タグ表記ゆれ対策 実装仕様(Phase 1 拡張)

ステータス: **実装済み**(2026-07-08)

## 背景

/learning の集計・記事化候補判定・ノート追記はすべて**タグの完全一致**に依存する。
しかし Issue フォームのタグ欄が自由入力だったため、`Kotlin` / `kotlin` のような
表記ゆれが「気をつける」以外で防げなかった。運用規律に頼る設計は必ず破綻する。

## 対策: ドロップダウン + 新規タグ欄の二段構成

Issue フォーム(`.github/ISSUE_TEMPLATE/note.yml`)のタグ入力を変更:

- **タグ**(dropdown, multiple): 既存タグから選択。スマホではタップで選ぶだけに
  なり、既存タグの表記ゆれは構造的に発生しなくなる
- **新規タグ**(input): 選択肢に無いタグだけカンマ区切りで自由入力する

`scripts/create-note-from-issue.mjs` は両セクションをマージ・重複排除して
frontmatter の `tags` に書き込む。

## 選択肢の自動同期

ドロップダウンの選択肢は `content/blog/` と `content/notes/` の全 frontmatter から
`scripts/update-note-template.mjs` が再生成する(冪等。変更が無ければ何もしない)。
**note.yml は自動生成ファイルであり、タグ選択肢を手で編集してはいけない。**

同期経路は2つ(両方必要):

1. `.github/workflows/sync-note-template.yml` — `content/**` への push で発火し、
   テンプレートを再生成して差分があれば commit
2. `note-capture.yml` 内の inline ステップ — Issue 経由のノート(新規タグを含み
   うる)は GITHUB_TOKEN での push のため 1 が発火しない(既知の落とし穴その2と
   同じ理由)。そこでノート生成直後に同スクリプトを実行し、ノートと同じ commit に
   テンプレート更新を含める

## 付随して修正した既存バグ: 日本語タイトルの slug 断片化

「パーステスト2」のような日本語主体のタイトルを slugify すると、日本語が消えて
`2` のような断片だけが残り、`2026-07-08-2.md` という意味不明な slug が生成されて
いた(空文字のときだけフォールバックする実装だったため)。

対策: slugify 結果が **3文字未満**なら意味のある slug ではないとみなし、
フォールバック(`note-<issue番号>` / `note` / `<date>-post`)を使う。
`create-note-from-issue.mjs` / `new-note.mjs` / `new-post.mjs` の3スクリプトすべてに
適用済み。

## 受け入れテスト(実装完了の定義)

1. `update-note-template.mjs` が実タグから正しい YAML を生成し、冪等である
2. ドロップダウン選択 + 新規タグ入力の Issue 本文から、マージ・重複排除された
   tags で frontmatter が生成される
3. 両方 `_No response_` でも tags: [] で正常に生成される
4. 日本語主体タイトルで slug がフォールバックする(3スクリプトとも)
5. `content/**` を push すると sync-note-template.yml がテンプレートを更新する
6. Issue 経由で新規タグ付きノートを作ると、同じ commit にテンプレート更新が含まれる
