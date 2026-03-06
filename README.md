# 簡易SNSアプリ

Next.js + Laravel で作ったシンプルなSNSアプリです。

## 技術スタック

| 役割 | 技術 |
|------|------|
| フロントエンド | Next.js 16 / TypeScript / Tailwind CSS |
| バックエンド | Laravel / Laravel Sanctum |
| データベース | MySQL 8 |
| 環境構築 | Docker / Docker Compose |

## 機能一覧

- ユーザー登録・ログイン・ログアウト
- 投稿の作成・編集・削除（自分のプロフィールページから投稿）
- タイムライン表示（10件ごとのページネーション）
- いいね
- ユーザー・投稿のキーワード検索（デバウンス付きリアルタイム検索）
- プロフィールページ

## 起動方法

### 1. リポジトリをクローン

```bash
git clone <リポジトリURL>
cd pra-api-sns3
```

### 2. 環境変数を設定

```bash
cp backend/.env.example backend/.env
```

`backend/.env` のDB設定を以下に変更：

```
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=root
```

### 3. Dockerを起動

```bash
docker compose up -d
```

### 4. バックエンドの初期設定

```bash
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate
```

### 5. アクセス

| 画面 | URL |
|------|-----|
| フロントエンド | http://localhost:3000 |
| バックエンドAPI | http://localhost:8000/api |

## 画面構成

```
/login        ログイン
/register     ユーザー登録
/dashboard    タイムライン
/profile/:id  プロフィール・投稿フォーム
/search       検索結果
```
