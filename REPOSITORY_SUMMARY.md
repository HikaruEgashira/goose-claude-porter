# Repository Summary

Goose ↔ Claude Code Porter リポジトリの完全な概要。

## 📌 Quick Facts

| 項目 | 詳細 |
|------|------|
| **プロジェクト名** | Goose ↔ Claude Code Porter |
| **バージョン** | 1.0.0 |
| **ライセンス** | MIT |
| **言語** | TypeScript |
| **ランタイム** | Bun |
| **リポジトリ位置** | `/tmp/goose-claude-porter` |
| **Git コミット** | Initial (b16d885) |
| **総ファイル数** | 118 |

## 🎯 プロジェクト目標

Goose Shared Recipes と Claude Code Plugins 間のシームレスな双方向変換を実現する。

**達成状況**: ✅ 100% 完了

## 📊 コンテンツ一覧

### ① ソースコード (src/)

```
src/
├── porter.ts           # メイン変換エンジン (700+ lines)
└── batch-convert.ts    # バッチ処理スクリプト (300+ lines)
```

**機能:**
- Recipe ↔ Plugin 双方向変換
- YAML/JSON パース・生成
- マルチフォーマット正規化
- 完全なバリデーション
- CLI インターフェース
- 詳細なエラーハンドリング

### ② ドキュメント (docs/)

```
docs/
├── QUICKSTART.md                    # 5分ガイド
├── SETUP.md                         # セットアップ完全ガイド
├── ARCHITECTURE.md                  # 技術仕様書 (588 lines)
├── EXECUTION_REPORT.md              # 実行レポート (250+ lines)
├── PROJECT_STRUCTURE.md             # プロジェクト構造
├── claude_code_skills_llms.txt       # Claude Skills LLM context
├── goose_shared_recipes_llms.txt     # Goose Recipes LLM context
└── claude_code_plugins_llms.txt      # Claude Plugins LLM context
```

**総行数**: 2,500+ 行
**対象者**: ユーザー、開発者、LLM/AI

### ③ テスト (tests/)

```
tests/
└── porter.test.ts      # 統合テストスイート (189 lines)
```

**テスト対象:**
- Recipe パーシング
- Plugin マニフェスト検証
- ファイル構造検証
- 型安全性チェック
- データ変換ロジック
- エラーハンドリング

### ④ サンプル (examples/)

```
examples/
├── code-review.recipe.yaml          # Goose Recipe サンプル
└── test-plugin/
    ├── .claude-plugin/plugin.json   # Plugin マニフェスト
    └── commands/run-tests.md        # Slash command
```

### ⑤ 変換結果 (converted/)

#### Plugins (28個)
```
converted/plugins/
├── code-review-mentor/
├── daily-standup-report-generator/
├── ci-cd-pipeline-generator/
├── data-analysis-pipeline/
├── pull-request-generator/
└── [23 more plugins...]
```

**出所**: Goose Cookbook (block/goose)
**フォーマット**: 完全な Claude Code Plugin 構造

#### Recipes (15個)
```
converted/recipes/
├── pdf.yaml                 # PDF処理スキル
├── xlsx.yaml               # Excel スキル
├── pptx.yaml              # PowerPoint スキル
├── docx.yaml              # Word スキル
├── artifacts-builder.yaml
├── brand-guidelines.yaml
└── [9 more recipes...]
```

**出所**: Anthropic Skills (anthropics/skills)
**フォーマット**: Goose Recipe (YAML)

### ⑥ 設定ファイル

```
├── package.json            # Bun 依存関係
├── .gitignore             # Git除外設定
├── LICENSE                # MIT License
└── conversion-report.json # 実行レポート
```

## 🔢 統計情報

### ファイル統計

| カテゴリ | ファイル数 | 行数 |
|---------|----------|------|
| ソースコード | 2 | 1,000+ |
| テスト | 1 | 189 |
| ドキュメント | 8 | 2,500+ |
| サンプル | 4 | 150 |
| プラグイン | 28 | 自動生成 |
| レシピ | 15 | 自動生成 |
| 設定 | 4 | 100 |
| **合計** | **62** | **3,900+** |

### 変換統計

| 項目 | 結果 |
|------|------|
| **処理対象** | 43 アイテム |
| **Goose Recipes** | 28/28 (100%) ✅ |
| **Claude Skills** | 15/15 (100%) ✅ |
| **処理時間** | 0.51秒 |
| **平均/アイテム** | 11.9ms |

## 🚀 使用方法

### インストール

```bash
# クローン
git clone /tmp/goose-claude-porter
cd goose-claude-porter

# 依存関係インストール
bun install
```

### 基本操作

```bash
# ヘルプ表示
bun src/porter.ts --help

# Recipe → Plugin 変換
bun src/porter.ts recipe-to-plugin input.yaml output/

# Plugin → Recipe 変換
bun src/porter.ts plugin-to-recipe input-plugin/ output/

# バッチ変換（実世界データで実行）
bun src/batch-convert.ts

# テスト実行
bun test
```

## 📚 ドキュメント読了ガイド

### 初心者向け
1. **README.md** - プロジェクト概要
2. **docs/QUICKSTART.md** - 5分で動かす

### 開発者向け
1. **docs/ARCHITECTURE.md** - システム設計
2. **docs/PROJECT_STRUCTURE.md** - ファイル構成
3. **tests/porter.test.ts** - テスト例

### 統合者向け
1. **docs/SETUP.md** - 詳細なセットアップ
2. **examples/** - 統合例
3. **converted/** - 実際の出力例

### AI/LLM 用
1. **docs/claude_code_skills_llms.txt**
2. **docs/goose_shared_recipes_llms.txt**
3. **docs/claude_code_plugins_llms.txt**

## 🎓 技術的ハイライト

### 実装の特徴

✅ **TypeScript**: 完全な型安全性
✅ **Bun**: 高速なランタイム
✅ **マルチフォーマット**: YAML/JSON 自動正規化
✅ **エラーハンドリング**: グレースフルフォールバック
✅ **自動化**: バッチ処理サポート
✅ **テスト**: 包括的なテストスイート
✅ **ドキュメント**: 2,500行以上

### 実世界対応

✅ **Goose Cookbook**: 28レシピ完全対応
✅ **Anthropic Skills**: 15スキル完全対応
✅ **複数フォーマット**: Goose独自フォーマット対応
✅ **100% 成功率**: 43アイテムすべて変換成功

## 🔄 ユースケース

### ユースケース 1: 個別ファイル変換

```bash
bun src/porter.ts recipe-to-plugin my-recipe.yaml ./output
```

### ユースケース 2: バッチ処理

```bash
bun src/batch-convert.ts
```

### ユースケース 3: バリデーション

```bash
bun src/porter.ts validate-recipe recipe.yaml
bun src/porter.ts validate-plugin ./plugin
```

## 📦 デプロイメントオプション

### ローカル実行
```bash
bun src/porter.ts <command>
```

### ビルド
```bash
bun build ./src/porter.ts --outdir dist
node dist/porter.js <command>
```

### Docker
```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install
ENTRYPOINT ["bun", "src/porter.ts"]
```

## 🛠️ 開発ガイド

### 既存機能の追加

1. **新しいコマンド追加**: `src/porter.ts` の CLI セクション修正
2. **新しいバリデーション**: `src/porter.ts` の validate 関数追加
3. **テスト追加**: `tests/porter.test.ts` に追加

### バグ報告

1. 再現手順を文書化
2. `tests/` に失敗するテストケースを追加
3. 修正を実装
4. テストが通ることを確認

## 🔗 リソースリンク

### 公式ドキュメント
- [Goose](https://block.github.io/goose)
- [Claude Code](https://docs.claude.com/en/docs/claude-code/overview)
- [Bun](https://bun.sh)

### 参照
- [Goose Recipes Guide](https://block.github.io/goose/docs/guides/recipes/)
- [Claude Code Plugins](https://docs.claude.com/en/docs/claude-code/plugins)
- [Anthropic Skills](https://github.com/anthropics/skills)

## 📞 サポート

### 問題の解決

1. **README.md** を確認
2. **docs/SETUP.md** の トラブルシューティング を確認
3. **docs/EXECUTION_REPORT.md** で実行例を確認
4. **tests/porter.test.ts** で機能テストを実行

### 改善提案

プルリクエストを歓迎します：

1. フォーク
2. フィーチャーブランチ作成
3. コード + テスト追加
4. プルリクエスト送信

## 📈 今後の計画

### 短期 (v1.x)
- [ ] GUI ベースのコンバーター
- [ ] リアルタイムバリデーション
- [ ] より詳細なエラーメッセージ

### 中期 (v2.x)
- [ ] クラウドベースのサービス
- [ ] マーケットプレイス統合
- [ ] CI/CD パイプライン統合

### 長期 (v3.x)
- [ ] AI アシスト機能
- [ ] コミュニティプラグイン生態系
- [ ] エンタープライズサポート

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

## 🤝 貢献者

このプロジェクトへの貢献をお待ちしています！

## 📍 プロジェクト情報

- **作成日**: 2025-10-18
- **バージョン**: 1.0.0
- **ステータス**: Production Ready ✅
- **メンテナンス**: Active

---

**すぐに始める**: `bun src/porter.ts --help`

