# トラブルシューティングガイド

## よくあるエラーと解決方法

### 500エラー: ユーザー登録/ログインに失敗する

#### 原因1: 環境変数が設定されていない

**症状:**
- `Registration failed` または `Login failed` エラー
- ブラウザのコンソールに500エラーが表示される

**解決方法:**

1. **ローカル開発環境の場合:**
   - プロジェクトルートに `.env.local` ファイルがあるか確認
   - 以下の環境変数が設定されているか確認：
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     SESSION_SECRET=your_session_secret
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```

2. **Vercel（本番環境）の場合:**
   - [Vercel Dashboard](https://vercel.com/dashboard)を開く
   - プロジェクトの **Settings** → **Environment Variables** を開く
   - すべての環境変数が設定されているか確認
   - 環境変数を設定/更新した後、**Redeploy** を実行

#### 原因2: データベーススキーマが適用されていない

**症状:**
- `relation "users" does not exist` エラー
- `table does not exist` エラー

**解決方法:**

1. Supabaseダッシュボードを開く
2. **SQL Editor** に移動
3. 以下のSQLファイルを順番に実行：
   - `supabase/migrations/001_initial_schema.sql` - テーブル作成
   - `supabase/migrations/003_disable_rls_for_custom_auth.sql` - RLS無効化

4. テーブルが作成されたか確認：
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
   - `users`, `profiles`, `swipes`, `matches`, `messages` テーブルが表示されるはずです

#### 原因3: Supabase接続情報が間違っている

**症状:**
- `Invalid API key` エラー
- `Failed to fetch` エラー

**解決方法:**

1. Supabaseダッシュボードで **Settings** → **API** を開く
2. 最新の認証情報をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

3. 環境変数を更新
4. サーバーを再起動（ローカル）または **Redeploy**（Vercel）

#### 原因4: RLS（Row Level Security）が有効になっている

**症状:**
- `permission denied` エラー
- データの取得/挿入に失敗する

**解決方法:**

このアプリは独自認証を使用しているため、RLSを無効化する必要があります。

1. Supabaseダッシュボードで **SQL Editor** を開く
2. `supabase/migrations/003_disable_rls_for_custom_auth.sql` を実行
3. 以下のSQLでRLSが無効になっているか確認：
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```
   - `rowsecurity` が `f`（false）になっているはずです

---

### 画像アップロードが失敗する

#### 原因1: Storageバケットが作成されていない

**解決方法:**

1. Supabaseダッシュボードで **Storage** を開く
2. `profile-photos` バケットが存在するか確認
3. 存在しない場合は作成：
   - **Create a new bucket**
   - バケット名: `profile-photos`
   - **Public bucket**: **ON**（重要！）

#### 原因2: Storage RLSポリシーが設定されていない

**解決方法:**

1. Supabaseダッシュボードで **SQL Editor** を開く
2. `supabase/migrations/004_storage_policies_for_custom_auth.sql` を実行

---

### リアルタイムメッセージが更新されない

#### 原因: Realtimeが有効になっていない

**解決方法:**

1. Supabaseダッシュボードで **Database** → **Replication** を開く
2. `messages` テーブルのレプリケーションを有効化
3. 以下のSQLを実行：
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE messages;
   ```

---

### Vercelでのデプロイエラー

#### 原因1: 環境変数が設定されていない

**解決方法:**

1. Vercelダッシュボードで環境変数を設定
2. 詳細は [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md) を参照

#### 原因2: ビルドエラー

**解決方法:**

1. Vercelのデプロイログを確認
2. エラーメッセージに従って修正
3. よくある問題：
   - TypeScriptエラー → 型定義を確認
   - 依存関係の問題 → `package.json` を確認

---

## デバッグ方法

### ローカル環境でのログ確認

```bash
# 開発サーバーを起動
npm run dev

# ブラウザのコンソールでエラーを確認
# サーバーのターミナルでエラーログを確認
```

### Vercelでのログ確認

1. Vercelダッシュボードを開く
2. プロジェクト → **Deployments** を開く
3. 最新のデプロイをクリック
4. **Functions** タブでログを確認

### Supabaseでのログ確認

1. Supabaseダッシュボードで **Logs** を開く
2. **API Logs** または **Postgres Logs** を確認

---

## 確認チェックリスト

問題が発生したら、以下を順番に確認してください：

- [ ] 環境変数が正しく設定されている（`.env.local` または Vercel設定）
- [ ] Supabaseプロジェクトが作成されている
- [ ] データベーススキーマが適用されている（`001_initial_schema.sql`）
- [ ] RLSが無効化されている（`003_disable_rls_for_custom_auth.sql`）
- [ ] Storageバケット `profile-photos` が作成されている（Public設定）
- [ ] Storage RLSポリシーが設定されている（`004_storage_policies_for_custom_auth.sql`）
- [ ] Supabase接続情報（URL、キー）が正しい
- [ ] サーバーが再起動されている（環境変数変更後）

---

## まだ解決しない場合

1. エラーメッセージの全文をコピー
2. ブラウザのコンソールのエラーも確認
3. サーバーログ（Vercel Functionsログなど）を確認
4. GitHubのIssuesに報告

---

**最後に更新: 2025年1月**
