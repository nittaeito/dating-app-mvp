# セットアップガイド

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成（またはログイン）
2. 「New Project」をクリック
3. プロジェクト名、データベースパスワード、リージョンを設定
4. プロジェクト作成完了を待つ（数分かかります）

## 2. データベーススキーマの適用

**重要**: このアプリは独自のCookieベース認証システムを使用しています。Supabase Authは使用していません。

1. Supabaseダッシュボードでプロジェクトを開く
2. 左メニューから「SQL Editor」を選択
3. 以下の順序でSQLファイルを実行してください：

### 2.1 初期スキーマの適用
1. 「New query」をクリック
2. `supabase/migrations/001_initial_schema.sql` の内容をコピー&ペースト
3. 「Run」ボタンをクリックして実行
4. エラーがなければ成功です

### 2.2 RLSの無効化（重要）
独自認証システムを使用しているため、RLSを無効化する必要があります。

1. 「New query」をクリック
2. `supabase/migrations/003_disable_rls_for_custom_auth.sql` の内容をコピー&ペースト
3. 「Run」ボタンをクリックして実行

**注意**: RLSポリシーファイル（`002_rls_policies.sql`）は実行しないでください。このアプリはSupabase Authを使用していないため、`auth.uid()`は機能しません。

## 3. Storageバケットの作成

1. Supabaseダッシュボードで左メニューから「Storage」を選択
2. 「Create a new bucket」をクリック
3. バケット名: `profile-photos`
4. Public bucket: **ON**（重要！）
5. 「Create bucket」をクリック

### Storage RLSポリシーの設定

Storageバケット作成後、以下のSQLファイルを実行してください：

1. 「New query」をクリック
2. `supabase/migrations/004_storage_policies_for_custom_auth.sql` の内容をコピー&ペースト
3. 「Run」ボタンをクリックして実行

**注意**: アップロード・削除・更新は全てサーバー側API（`createAdminClient`使用）でのみ実行されます。クライアント側からの直接操作は許可していません。

## 4. 環境変数の設定

1. Supabaseダッシュボードで左メニューから「Settings」→「API」を選択
2. 以下の値をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`（注意：このキーは秘密にしてください）

3. `.env.local` ファイルを開いて、コピーした値を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SESSION_SECRET=your-random-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**重要**: `SESSION_SECRET`にはランダムな文字列を設定してください（例：`openssl rand -base64 32`で生成）

## 5. 依存関係のインストール

```bash
npm install
```

## 6. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## トラブルシューティング

### エラー: "Invalid API key"
- `.env.local`のSupabase認証情報が正しいか確認してください
- SupabaseダッシュボードのAPI設定から最新のキーを取得してください

### エラー: "relation does not exist"
- データベーススキーマが正しく適用されているか確認してください
- SQL Editorでテーブルが作成されているか確認してください

### エラー: "Bucket not found"
- Storageバケット `profile-photos` が作成されているか確認してください
- バケット名が正確に `profile-photos` であることを確認してください

### 画像アップロードが失敗する
- StorageバケットがPublicに設定されているか確認してください
- RLSポリシーが正しく設定されているか確認してください

