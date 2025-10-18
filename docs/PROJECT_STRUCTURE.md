# プロジェクト構造

Goose ↔ Claude Code Porter リポジトリの完全な構造とファイル説明。

## 📁 ディレクトリ構成

```
goose-claude-porter/
├── src/                          # ソースコード
│   ├── porter.ts                # メインスクリプト (Porter エンジン)
│   └── batch-convert.ts         # バッチ変換スクリプト
│
├── tests/                        # テストスイート
│   └── porter.test.ts           # ユニット・統合テスト
│
├── docs/                         # ドキュメント
│   ├── QUICKSTART.md            # 5分ガイド
│   ├── SETUP.md                 # セットアップガイド
│   ├── ARCHITECTURE.md          # 技術仕様書
│   ├── EXECUTION_REPORT.md      # 実行レポート
│   ├── PROJECT_STRUCTURE.md     # このファイル
│   ├── claude_code_skills_llms.txt       # Claude Code Skills コンテキスト
│   ├── goose_shared_recipes_llms.txt     # Goose Recipes コンテキスト
│   └── claude_code_plugins_llms.txt      # Claude Code Plugins コンテキスト
│
├── examples/                     # サンプルファイル
│   ├── code-review.recipe.yaml  # Goose Recipe サンプル
│   └── test-plugin/             # Claude Code Plugin サンプル
│       ├── .claude-plugin/plugin.json
│       └── commands/run-tests.md
│
├── converted/                    # 変換結果 (実世界データ)
│   ├── plugins/                 # 28個の変換プラグイン
│   │   ├── code-review-mentor/
│   │   ├── daily-standup-report-generator/
│   │   ├── ci-cd-pipeline-generator/
│   │   └── [25 more plugins...]
│   │
│   └── recipes/                 # 15個の変換レシピ
│       ├── pdf.yaml
│       ├── xlsx.yaml
│       ├── pptx.yaml
│       └── [12 more recipes...]
│
├── package.json                  # Bun 依存関係
├── README.md                     # プロジェクト概要
├── .gitignore                    # Git除外ファイル
└── conversion-report.json        # 最終実行レポート
```

## 📄 ファイル説明

### ソースコード (src/)

#### porter.ts
**行数**: 700+
**役割**: メインのPython ↔ Claude Code 変換エンジン

**主な機能:**
- Recipe ↔ Plugin 双方向変換
- YAML/JSON パースと生成
- バリデーション機能
- CLI インターフェース
- エラーハンドリング

**主要な関数:**
- `parseRecipe()` - Goose Recipe パース
- `recipeToPlugin()` - Recipe → Plugin 変換
- `pluginToRecipe()` - Plugin → Recipe 変換
- `validateRecipe()` - Recipe 検証
- `validatePlugin()` - Plugin 検証

#### batch-convert.ts
**行数**: 300+
**役割**: 複数ファイルのバッチ変換処理

**主な機能:**
- ディレクトリ走査
- 並列処理対応
- 進捗報告
- 統計情報生成
- エラーレポート生成

### テスト (tests/)

#### porter.test.ts
**行数**: 189
**役割**: ユニット・統合テスト

**テストカバレッジ:**
- Recipe パーステスト
- Plugin マニフェスト検証
- ファイル構造検証
- 型安全チェック
- データ変換テスト
- エラーハンドリング
- 統合シナリオ

### ドキュメント (docs/)

#### QUICKSTART.md
**対象**: 初心者・急ぎのユーザー
**所要時間**: 5分
**内容**:
- 最小限のセットアップ
- 基本的なコマンド例
- よくある質問

#### SETUP.md
**対象**: セットアップが必要なユーザー
**内容**:
- 詳細なインストール手順
- 環境変数設定
- 統合ガイド (Goose, Claude Code)
- トラブルシューティング
- スクリプト例

#### ARCHITECTURE.md
**対象**: 開発者・技術者
**内容**:
- システム設計
- コンポーネント説明
- データ構造定義
- 変換ロジック
- エラーハンドリング戦略
- 拡張性ガイド

#### EXECUTION_REPORT.md
**対象**: 実行結果に興味のあるユーザー
**内容**:
- 実行概要
- 成功統計 (28/28 Recipes, 15/15 Skills)
- 変換されたファイルリスト
- 品質検証結果
- パフォーマンス分析
- 学習成果と改善提案

#### LLM コンテキストファイル
**対象**: LLM/AI モデル
**形式**: テキスト形式で LLM がアクセス可能
**内容**:
- `claude_code_skills_llms.txt` - Claude Code Skills の完全ガイド
- `goose_shared_recipes_llms.txt` - Goose Recipes の完全ガイド
- `claude_code_plugins_llms.txt` - Claude Code Plugins の完全ガイド

### サンプルファイル (examples/)

#### code-review.recipe.yaml
**形式**: Goose Recipe (YAML)
**用途**: Porter の入力例
**内容**: Code Review Assistant の実装例

#### test-plugin/
**形式**: Claude Code Plugin
**構造**:
- `.claude-plugin/plugin.json` - マニフェスト
- `commands/run-tests.md` - slash command

### 変換結果 (converted/)

#### plugins/ (28個)
**出所**: Goose Cookbook レシピから自動変換

**サンプル構造** (code-review-mentor/):
```
code-review-mentor/
├── .claude-plugin/
│   └── plugin.json
│       ├── id: "code-review-mentor"
│       ├── name: "Code Review Mentor"
│       ├── environment_variables: [...]
│       └── ...
├── commands/
│   └── code-review-mentor.md
└── README.md
```

**含まれるプラグイン:**
- Daily Standup Report Generator
- Code Review Mentor
- CI/CD Pipeline Generator
- Data Analysis Pipeline
- Pull Request Generator
- Code Documentation Generator
- Chart Generator
- [21 more...]

#### recipes/ (15個)
**出所**: Anthropic Skills から自動変換

**サンプルフォーマット** (pdf.yaml):
```yaml
version: 1.0.0
title: pdf
description: Comprehensive PDF manipulation toolkit...
instructions: |
  # PDF Processing Guide
  [Complete instructions with examples...]
prompt: Apply the pdf skill to the current task.
```

**含まれるレシピ:**
- PDF (Document skill)
- XLSX (Document skill)
- PPTX (Document skill)
- DOCX (Document skill)
- Artifacts Builder
- Brand Guidelines
- Canvas Design
- Algorithmic Art
- Webapp Testing
- MCP Builder
- Skill Creator
- Internal Communications
- Slack GIF Creator
- Theme Factory
- Template Skill

### 設定ファイル

#### package.json
```json
{
  "name": "goose-claude-porter",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/porter.js",
  "bin": {
    "porter": "./src/porter.ts"
  },
  "scripts": {
    "dev": "bun src/porter.ts",
    "build": "bun build ./src/porter.ts --outdir dist",
    "test": "bun test",
    "batch": "bun src/batch-convert.ts",
    "help": "bun src/porter.ts --help"
  },
  "dependencies": {
    "js-yaml": "^4.1.0"
  }
}
```

#### .gitignore
Node.js, IDE, ビルド出力ファイルを除外

## 📊 ファイル統計

| カテゴリ | 数 | 行数 |
|---------|-----|------|
| **ソースコード** | 2 | 1,000+ |
| **テスト** | 1 | 189 |
| **ドキュメント** | 8 | 2,500+ |
| **サンプル** | 4 | 150 |
| **変換プラグイン** | 28 | 自動生成 |
| **変換レシピ** | 15 | 自動生成 |
| **設定** | 2 | 100 |
| **合計** | 60+ | 3,900+ |

## 🚀 使用方法

### セットアップ
```bash
cd goose-claude-porter
bun install
```

### 基本的な使用
```bash
# ヘルプ表示
bun src/porter.ts --help

# Recipe → Plugin 変換
bun src/porter.ts recipe-to-plugin examples/code-review.recipe.yaml ./output

# Plugin → Recipe 変換
bun src/porter.ts plugin-to-recipe examples/test-plugin ./output

# バッチ変換 (実世界データ)
bun src/batch-convert.ts
```

### テスト実行
```bash
bun test
```

## 📚 ドキュメント読了順序

1. **README.md** - プロジェクト全体概要
2. **QUICKSTART.md** - 5分で実行してみたい場合
3. **SETUP.md** - 詳細なセットアップが必要な場合
4. **ARCHITECTURE.md** - 技術的な詳細を理解したい場合
5. **EXECUTION_REPORT.md** - 実行結果と成功事例を確認したい場合
6. **PROJECT_STRUCTURE.md** - このファイル

## 🔗 リソースマップ

### コード開発
- `src/porter.ts` - main conversion engine
- `tests/porter.test.ts` - test suite
- `src/batch-convert.ts` - batch processing

### 学習
- `docs/ARCHITECTURE.md` - internal design
- `docs/QUICKSTART.md` - fast start

### 統合
- `docs/SETUP.md` - integration guide
- `examples/` - integration examples
- `converted/` - real-world output samples

### AI/LLM
- `docs/*_llms.txt` - LLM context files

## 🎯 一般的なワークフロー

### ワークフロー 1: 単一ファイル変換
```
recipe.yaml → src/porter.ts → plugin/
```

### ワークフロー 2: バッチ変換
```
recipes/ → src/batch-convert.ts → plugins/ + recipes/
```

### ワークフロー 3: 統合テスト
```
examples/ → tests/porter.test.ts → ✅ validation
```

## 📦 デプロイメント

### ローカル実行
```bash
bun src/porter.ts <command> [args]
```

### ビルド済みバージョン
```bash
bun build ./src/porter.ts --outdir dist
node dist/porter.js <command> [args]
```

### Docker 実行 (オプション)
```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install
ENTRYPOINT ["bun", "src/porter.ts"]
```

## 🔄 メンテナンス

### 依存関係の更新
```bash
bun update
```

### テストの実行
```bash
bun test
```

### ドキュメントの更新
- ドキュメントは `docs/` 配下に Markdown 形式で管理
- LLM コンテキストは `docs/*_llms.txt` で管理

## 🤝 貢献

プロジェクトに貢献するには:

1. フォーク & クローン
2. フィーチャーブランチ作成
3. コード + テスト追加
4. プルリクエスト送信

---

**最終更新**: 2025-10-18
**バージョン**: 1.0.0
**ライセンス**: MIT
