# アプリ公開手順書 (Vercel + Supabase)

アプリを実際に使えるようにするための手順です。

## ステップ 1: GitHubへのプッシュ (完了済み)
ソースコードは既に `https://github.com/nittaeito/dating-app-mvp` にアップロードされています。

## ステップ 2: Supabase (データベース) のセットアップ

1. **[Supabase](https://supabase.com)** にログインし、新しいプロジェクトを作成します。
2. 左メニューの **SQL Editor** を開きます。
3. プロジェクト内の `supabase/init_full_database.sql` の内容をコピーして、SQL Editorに貼り付けます。
4. **Run** ボタンを押して実行します。
   - これでデータベースのテーブルと、画像保存用のStorage設定が一括で完了します。

## ステップ 3: Vercel (公開) のセットアップ

1. **[Vercel](https://vercel.com)** にログインし、**Add New... > Project** を選択します。
2. GitHubリポジトリ `nittaeito/dating-app-mvp` をインポートします。
3. **Environment Variables (環境変数)** セクションを開き、以下の値を設定します。

これらの値は Supabase のダッシュボード (Project Settings > API) から取得してください。

| 環境変数名 | 値の取得場所 |
|------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API > `anon` public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API > `service_role` secret |
| `SESSION_SECRET` | 任意の長い文字列 (例: `my-super-secret-password-123`) |
| `NEXT_PUBLIC_APP_URL` | Vercelが生成するURL (例: `https://dating-app-mvp.vercel.app`) ※デプロイ後に設定でもOK |
| `NODE_ENV` | `production` |

4. **Deploy** をクリックします。

## ステップ 4: 動作確認

デプロイが完了したら、Vercelが発行したURLにアクセスして、以下の順でテストしてください：

1. **新規登録**: `/auth/register` からアカウント作成
2. **プロフィール作成**: 写真のアップロードが動くか確認
3. **スワイプ**: 複数のユーザー（ブラウザのシークレットモード等で別アカウント作成）でいいねし合う
4. **マッチング**: マッチ後にチャットができるか確認

これでアプリが完全に動作するようになります！
