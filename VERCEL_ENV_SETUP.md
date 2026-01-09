# Vercel環境変数設定 - 値の一覧

以下の環境変数をVercelダッシュボードで設定してください。

## 📋 設定する環境変数と値

### 1. NEXT_PUBLIC_SUPABASE_URL
```
値: https://dpapkqtvuabnglrffqbw.supabase.co
```
**設定場所**: Vercel Dashboard → Settings → Environment Variables

---

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
値: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYXBrcXR2dWFibmdscmZmcWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MjY2NzAsImV4cCI6MjA4MzUwMjY3MH0.XxL1h6wO1VeENM4E_9A3iDr2_yTmbhYKSbrICqY7ZoI
```
**設定場所**: Vercel Dashboard → Settings → Environment Variables

---

### 3. SUPABASE_SERVICE_ROLE_KEY
```
値: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYXBrcXR2dWFibmdscmZmcWJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzkyNjY3MCwiZXhwIjoyMDgzNTAyNjcwfQ.tS1tipYQU9tHwNj3ZNBUWSpF_V49Y-eoC9q8UIoiYVc
```
**⚠️ 重要**: このキーは機密情報です。絶対に公開しないでください。
**設定場所**: Vercel Dashboard → Settings → Environment Variables

---

### 4. SESSION_SECRET
```
値: dpapkqtvuabnglrffqbw_dating_app_secret_2025
```
**設定場所**: Vercel Dashboard → Settings → Environment Variables

---

### 5. NEXT_PUBLIC_APP_URL
```
値: https://YOUR_PROJECT_NAME.vercel.app
```
**⚠️ 注意**: 
- `YOUR_PROJECT_NAME`を実際のVercelプロジェクト名に置き換えてください
- 例: `https://dating-app-mvp.vercel.app`
- 初回デプロイ後、Vercelが提供するURLを確認して設定してください

**確認方法**:
1. Vercel Dashboard → プロジェクトを選択
2. **Deployments** タブを開く
3. 最新のデプロイのURLをコピー（例: `https://dating-app-mvp-xxx.vercel.app`）

---

## 🔧 Vercelでの設定手順

### ステップ1: Vercelダッシュボードを開く
1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. プロジェクトを選択（または新規プロジェクトを作成）

### ステップ2: 環境変数を設定
1. **Settings** タブをクリック
2. 左メニューから **Environment Variables** を選択
3. 以下の環境変数を1つずつ追加：

#### 環境変数の追加方法
1. **Key** に環境変数名を入力（例: `NEXT_PUBLIC_SUPABASE_URL`）
2. **Value** に上記の値をペースト
3. **Environment** で以下をすべてチェック：
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. **Save** をクリック
5. 残りの環境変数も同様に追加

### ステップ3: 確認
すべての環境変数を追加したら、以下の5つが表示されていることを確認：
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ SESSION_SECRET
- ✅ NEXT_PUBLIC_APP_URL

### ステップ4: 再デプロイ
1. 環境変数を追加/更新した後、必ず **Redeploy** を実行
2. プロジェクトページの **Deployments** タブを開く
3. 最新のデプロイの **...** メニューから **Redeploy** を選択
4. または、GitHubにプッシュして自動デプロイをトリガー

---

## 📝 クイックコピー用（一括設定）

Vercelの環境変数設定画面で、以下のように設定してください：

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dpapkqtvuabnglrffqbw.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYXBrcXR2dWFibmdscmZmcWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MjY2NzAsImV4cCI6MjA4MzUwMjY3MH0.XxL1h6wO1VeENM4E_9A3iDr2_yTmbhYKSbrICqY7ZoI` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwYXBrcXR2dWFibmdscmZmcWJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzkyNjY3MCwiZXhwIjoyMDgzNTAyNjcwfQ.tS1tipYQU9tHwNj3ZNBUWSpF_V49Y-eoC9q8UIoiYVc` | Production, Preview, Development |
| `SESSION_SECRET` | `dpapkqtvuabnglrffqbw_dating_app_secret_2025` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://YOUR_PROJECT_NAME.vercel.app` | Production, Preview, Development |

---

## ✅ 設定後の確認方法

環境変数が正しく設定されているか確認する方法：

1. **Vercelダッシュボードで確認**
   - Settings → Environment Variables で5つの環境変数が表示されているか確認

2. **デプロイログで確認**
   - デプロイログに環境変数エラーが表示されていないか確認
   - `NEXT_PUBLIC_SUPABASE_URL environment variable is not set` のようなエラーが出ていないか確認

3. **アプリの動作で確認**
   - デプロイ後、アプリにアクセスしてユーザー登録ができるか確認
   - 500エラーが出ないか確認

---

## ⚠️ 重要な注意事項

1. **SUPABASE_SERVICE_ROLE_KEYは機密情報**
   - このキーは絶対に公開しないでください
   - GitHubや公開リポジトリにコミットしないでください

2. **NEXT_PUBLIC_APP_URLは実際のURLに更新**
   - 初回デプロイ後に、Vercelが提供する実際のURLに更新してください
   - 例: `https://dating-app-mvp-abc123.vercel.app`

3. **環境変数変更後は必ず再デプロイ**
   - 環境変数を追加/変更した後は、必ずRedeployを実行してください
   - 再デプロイしないと変更が反映されません

---

## 🆘 トラブルシューティング

### 環境変数が反映されない
- **解決方法**: 再デプロイを実行してください

### NEXT_PUBLIC_APP_URLがわからない
- **解決方法**: Vercel Dashboard → Deployments で最新のデプロイのURLを確認してください

### まだエラーが出る
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) を参照してください

---

**最終更新**: 2025年1月
