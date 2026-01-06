# GitHubリポジトリ作成とVercel連携ガイド

## ステップ1: GitHubでリポジトリを作成

1. **GitHubにログイン** (https://github.com)
2. 右上の **「+」** ボタン → **「New repository」** をクリック
3. リポジトリ設定：
   - **Repository name**: `dating-app-mvp` (お好みの名前)
   - **Description**: (任意) マッチングアプリ MVP
   - **Public** または **Private** を選択
   - **⚠️ 重要**: 「Add a README file」「Add .gitignore」「Choose a license」は**チェックしない**（既にコードがあるため）
4. **「Create repository」** をクリック

## ステップ2: ローカルコードをGitHubにプッシュ

GitHubでリポジトリを作成すると、次のような画面が表示されます。
その画面に表示されているコマンドを実行します：

```bash
# 既存のリモートを削除（プレースホルダーが設定されている場合）
git remote remove origin

# GitHubで作成したリポジトリのURLを設定
# ⚠️ 以下は例です。GitHubで表示された実際のURLに置き換えてください
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git

# ブランチ名をmainに変更（必要に応じて）
git branch -M main

# コードをプッシュ
git push -u origin main
```

## ステップ3: Vercelでプロジェクトをインポート

1. **Vercelにログイン** (https://vercel.com)
2. **「Add New...」** → **「Project」** をクリック
3. **GitHubリポジトリを選択**（先ほど作成したリポジトリ）
4. プロジェクト設定：
   - **Framework Preset**: Next.js（自動検出）
   - **Root Directory**: `./`（そのまま）
   - **Build Command**: `npm run build`（デフォルト）
   - **Output Directory**: `.next`（デフォルト）
5. **「Deploy」** をクリック

## ステップ4: 環境変数を設定

デプロイ後、**Settings** → **Environment Variables** で以下を追加：

```
NEXT_PUBLIC_SUPABASE_URL=https://mscuxylyloerhxzkzven.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zY3V4eWx5bG9lcmh4emt6dmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2Njg5NDIsImV4cCI6MjA4MzI0NDk0Mn0._ltmL4Nevo0zK2hK8QGAvbddPVHKk33JoGOfSnSSBIo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zY3V4eWx5bG9lcmh4emt6dmVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2ODk0MiwiZXhwIjoyMDgzMjQ0OTQyfQ.ag_Hc7E9jOn_MTLMLMLVBliWV66oXTkYFhyEhwO5jtFbU
SESSION_SECRET=mscuxylyloerhxzkzven
NEXT_PUBLIC_APP_URL=https://YOUR_PROJECT_NAME.vercel.app
NODE_ENV=production
```

**注意**: `NEXT_PUBLIC_APP_URL`は、Vercelがデプロイ後に提供するURLに置き換えてください。

各環境変数で、**Production、Preview、Development**すべてにチェックを入れてください。

## ステップ5: 再デプロイ

環境変数を設定したら、**「Redeploy」** をクリックして再デプロイします。

## トラブルシューティング

### GitHubリポジトリが見つからない場合

- VercelとGitHubの連携を確認
- Vercelの設定でGitHubアカウントが正しく接続されているか確認

### プッシュが失敗する場合

- GitHubの認証情報を確認
- Personal Access Tokenが必要な場合があります

