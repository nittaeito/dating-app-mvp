# Vercel環境変数設定ガイド

## 設定手順

1. Vercelのプロジェクトページを開く
2. **Settings** → **Environment Variables** を開く
3. 以下の環境変数を1つずつ追加
4. 各環境変数で **Production、Preview、Development** すべてにチェックを入れる

## 環境変数一覧

### 1. NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://dpapkqtvuabnglrffqbw.supabase.co
Environment: ✅ Production, ✅ Preview, ✅ Development
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYXBrcXR2dWFibmdscmZmcWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MjY2NzAsImV4cCI6MjA4MzUwMjY3MH0.XxL1h6wO1VeENM4E_9A3iDr2_yTmbhYKSbrICqY7ZoI
Environment: ✅ Production, ✅ Preview, ✅ Development
```

### 3. SUPABASE_SERVICE_ROLE_KEY
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYXBrcXR2dWFibmdscmZmcWJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzkyNjY3MCwiZXhwIjoyMDgzNTAyNjcwfQ.tS1tipYQU9tHwNj3ZNBUWSpF_V49Y-eoC9q8UIoiYVc
Environment: ✅ Production, ✅ Preview, ✅ Development
```

### 4. SESSION_SECRET
```
Name: SESSION_SECRET
Value: dpapkqtvuabnglrffqbw_dating_app_secret_2025
Environment: ✅ Production, ✅ Preview, ✅ Development
```
**⚠️ 注意**: SESSION_SECRETは本番環境用のランダムな文字列に変更することを推奨します。強力なセキュリティのため、32文字以上のランダムな文字列を使用してください。

### 5. NEXT_PUBLIC_APP_URL
```
Name: NEXT_PUBLIC_APP_URL
Value: https://YOUR_PROJECT_NAME.vercel.app
Environment: ✅ Production, ✅ Preview, ✅ Development
```
**⚠️ 重要**: `YOUR_PROJECT_NAME`を実際のVercelプロジェクト名に置き換えてください。
デプロイ後にVercelが提供するURLを使用します（例: `https://dating-app-mvp.vercel.app`）

### 6. NODE_ENV
```
Name: NODE_ENV
Value: production
Environment: ✅ Production, ✅ Preview, ✅ Development
```

## クイックコピー用（一括設定）

Vercelの環境変数設定画面で、以下の形式でコピー&ペーストできます：

```
NEXT_PUBLIC_SUPABASE_URL=https://dpapkqtvuabnglrffqbw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYXBrcXR2dWFibmdscmZmcWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MjY2NzAsImV4cCI6MjA4MzUwMjY3MH0.XxL1h6wO1VeENM4E_9A3iDr2_yTmbhYKSbrICqY7ZoI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYXBrcXR2dWFibmdscmZmcWJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzkyNjY3MCwiZXhwIjoyMDgzNTAyNjcwfQ.tS1tipYQU9tHwNj3ZNBUWSpF_V49Y-eoC9q8UIoiYVc
SESSION_SECRET=dpapkqtvuabnglrffqbw_dating_app_secret_2025
NEXT_PUBLIC_APP_URL=https://YOUR_PROJECT_NAME.vercel.app
NODE_ENV=production
```

## 注意事項

1. **NEXT_PUBLIC_APP_URL**: 初回デプロイ後にVercelが提供するURLに置き換えてください
2. **SUPABASE_SERVICE_ROLE_KEY**: 機密情報です。GitHubにコミットしないでください
3. **環境変数の変更後**: 必ず「Redeploy」を実行して再デプロイしてください

## 設定後の確認

環境変数を設定したら：
1. すべての環境変数が正しく設定されているか確認
2. 「Redeploy」ボタンをクリックして再デプロイ
3. デプロイが完了したら、提供されたURLでアプリが正常に動作するか確認

