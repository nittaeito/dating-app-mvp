# Supabase接続セットアップガイド

このガイドでは、デートアプリMVPをSupabaseに接続して、すべての機能が正常に動作するようにセットアップする手順を説明します。

## ⚠️ 重要な注意事項

このアプリは**独自のCookieベース認証システム**を使用しています。**Supabase Authは使用していません**。
そのため、RLS（Row Level Security）ポリシーは無効化しており、認証制御はAPIルート側で行います。

---

## ステップ1: Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成（またはログイン）
2. 「New Project」をクリック
3. 以下の情報を入力：
   - **Name**: プロジェクト名（例：`dating-app-mvp`）
   - **Database Password**: 強力なパスワードを設定（忘れずにメモしてください）
   - **Region**: 最寄りのリージョンを選択（例：`Tokyo (ap-northeast-1)`）
4. 「Create new project」をクリック
5. プロジェクト作成完了を待つ（2-3分かかります）

---

## ステップ2: 環境変数の取得

1. Supabaseダッシュボードでプロジェクトを開く
2. 左メニューから「Settings」→「API」を選択
3. 以下の値をコピー（後で使用します）：

   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
     - ⚠️ **重要**: このキーは秘密にしてください。絶対に公開しないでください。

---

## ステップ3: データベーススキーマの適用

### 3.1 初期スキーマの作成

1. Supabaseダッシュボードで左メニューから「SQL Editor」を選択
2. 「New query」をクリック
3. プロジェクトの `supabase/migrations/001_initial_schema.sql` ファイルを開く
4. ファイルの内容をすべてコピー
5. SQL Editorにペースト
6. 「Run」ボタン（または `Ctrl+Enter` / `Cmd+Enter`）をクリック
7. 成功メッセージが表示されることを確認

### 3.2 RLSの無効化（必須）

このアプリは独自認証を使用しているため、RLSを無効化します。

1. 「New query」をクリック
2. プロジェクトの `supabase/migrations/003_disable_rls_for_custom_auth.sql` ファイルを開く
3. ファイルの内容をすべてコピー
4. SQL Editorにペースト
5. 「Run」ボタンをクリック
6. 成功メッセージが表示されることを確認

**なぜRLSを無効化するのか？**
- このアプリはSupabase Authではなく、独自のCookieベース認証を使用
- RLSポリシーは`auth.uid()`を使用するため、独自認証では機能しない
- 代わりに、APIルート側で`createAdminClient()`を使用して認証制御を行う

---

## ステップ4: Storageバケットの作成

### 4.1 バケットの作成

1. Supabaseダッシュボードで左メニューから「Storage」を選択
2. 「Create a new bucket」をクリック
3. 以下の設定を入力：
   - **Name**: `profile-photos`
   - **Public bucket**: **ON**（トグルを有効化）
4. 「Create bucket」をクリック

### 4.2 Storage RLSポリシーの設定

1. 「SQL Editor」に戻る
2. 「New query」をクリック
3. プロジェクトの `supabase/migrations/004_storage_policies_for_custom_auth.sql` ファイルを開く
4. ファイルの内容をすべてコピー
5. SQL Editorにペースト
6. 「Run」ボタンをクリック

**注意**: アップロード・削除・更新は全てサーバー側API経由でのみ実行されます。

---

## ステップ5: ローカル環境変数の設定

1. プロジェクトのルートディレクトリに `.env.local` ファイルを作成
2. 以下の内容を入力（ステップ2で取得した値を使用）：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# セッション暗号化キー（任意のランダムな文字列）
# 本番環境では必ず変更してください
SESSION_SECRET=your_random_session_secret_key_change_in_production

# アプリのURL
# 開発時: http://localhost:3000
# 本番環境: https://your-domain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. ファイルを保存

**SESSION_SECRETの生成方法（推奨）：**
```bash
# macOS/Linux
openssl rand -base64 32

# または、Node.jsで生成
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## ステップ6: 依存関係のインストール

```bash
npm install
```

---

## ステップ7: 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

---

## 動作確認チェックリスト

以下を順番に確認してください：

### ✅ 認証機能
- [ ] ユーザー登録ができる
- [ ] ログインができる
- [ ] ログアウトができる

### ✅ プロフィール機能
- [ ] プロフィール作成ができる
- [ ] プロフィール編集ができる
- [ ] 写真アップロードができる（1-3枚）
- [ ] アップロードした写真が表示される

### ✅ スワイプ機能
- [ ] 候補ユーザーが表示される
- [ ] スワイプ操作（ドラッグ&ドロップ）ができる
- [ ] 「いいね」「スキップ」ボタンが動作する

### ✅ マッチング機能
- [ ] 相互いいねでマッチングが成立する
- [ ] マッチング一覧が表示される

### ✅ チャット機能
- [ ] マッチング後のチャット画面が表示される
- [ ] メッセージの送信ができる
- [ ] メッセージの受信ができる（リアルタイム）

---

## トラブルシューティング

### エラー: "Invalid API key"
**原因**: 環境変数が正しく設定されていない
**解決方法**:
1. `.env.local`ファイルが正しい場所にあるか確認（プロジェクトルート）
2. SupabaseダッシュボードのAPI設定から最新のキーを取得
3. 環境変数の名前が正確か確認（大文字小文字を含む）

### エラー: "relation does not exist" または "table does not exist"
**原因**: データベーススキーマが適用されていない
**解決方法**:
1. SQL Editorで`supabase/migrations/001_initial_schema.sql`を実行したか確認
2. エラーメッセージを確認して、どのテーブルが不足しているか確認
3. 必要に応じて、スキーマファイルを再度実行

### エラー: "Bucket not found"
**原因**: Storageバケットが作成されていない
**解決方法**:
1. SupabaseダッシュボードのStorageセクションを確認
2. `profile-photos`バケットが存在するか確認
3. バケット名が正確に`profile-photos`であることを確認（大文字小文字を含む）

### 画像アップロードが失敗する
**原因**: Storageバケットの設定またはRLSポリシーの問題
**解決方法**:
1. バケットがPublicに設定されているか確認
2. `supabase/migrations/004_storage_policies_for_custom_auth.sql`が実行されているか確認
3. ブラウザのコンソールとサーバーログでエラーメッセージを確認

### RLSポリシーエラーが発生する
**原因**: RLSが有効になっている、または不正なポリシーが適用されている
**解決方法**:
1. `supabase/migrations/003_disable_rls_for_custom_auth.sql`が実行されているか確認
2. SQL Editorで以下を実行してRLSを無効化：
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
   ALTER TABLE swipes DISABLE ROW LEVEL SECURITY;
   ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
   ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
   ```

### メッセージがリアルタイムで更新されない
**原因**: Supabase Realtimeの設定の問題
**解決方法**:
1. Supabaseダッシュボードで「Database」→「Replication」を確認
2. `messages`テーブルがレプリケーション有効になっているか確認
3. 必要に応じて、レプリケーションを有効化

---

## セキュリティに関する注意

1. **SUPABASE_SERVICE_ROLE_KEYは絶対に公開しない**
   - このキーはサーバー側でのみ使用
   - `.env.local`をGitにコミットしない（`.gitignore`に含まれていることを確認）
   - 本番環境では環境変数として安全に管理

2. **SESSION_SECRETは本番環境で変更**
   - 開発環境と本番環境で異なる値を使用
   - 強力なランダム文字列を使用

3. **データベースパスワードは安全に保管**
   - 忘れないように安全な場所に保存

---

## 次のステップ

セットアップが完了したら、以下を参照してください：

- [README.md](./README.md) - プロジェクト概要
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - 詳細なセットアップガイド
- [HEARING_SHEET.md](./HEARING_SHEET.md) - 機能要件ヒアリングシート

---

**質問や問題が発生した場合は、GitHubのIssuesでお知らせください。**
