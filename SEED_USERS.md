# テストユーザー作成ガイド

## 方法1: 開発ページから作成（推奨）

1. ブラウザで以下のURLにアクセス：
   - ローカル開発: `http://localhost:3000/dev`
   - 本番環境: `https://your-app.vercel.app/dev`

2. 「テストユーザーを作成（男女10人ずつ）」ボタンをクリック

3. 作成が完了すると、作成されたユーザーのリストが表示されます

---

## 方法2: APIを直接呼び出す

### cURLコマンドで実行

```bash
curl -X POST https://your-app.vercel.app/api/dev/seed-users \
  -H "Content-Type: application/json" \
  -d '{"count": 10}'
```

### ブラウザのコンソールから実行

1. ブラウザのデベロッパーツール（F12）を開く
2. Consoleタブを開く
3. 以下のコードを実行：

```javascript
fetch('/api/dev/seed-users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ count: 10 })
})
  .then(res => res.json())
  .then(data => {
    console.log('結果:', data);
    if (data.success) {
      console.log(`${data.data.message}`);
      console.log('作成されたユーザー:', data.data.users);
    } else {
      console.error('エラー:', data.error);
    }
  });
```

---

## 作成されるテストユーザー

### 男性ユーザー（10人）
- メールアドレス: `male1@test.com` ～ `male10@test.com`
- パスワード: `test1234`（全員共通）
- ニックネーム: 太郎、次郎、三郎、健太、大輔、翔太、拓也、直樹、和也、慎一
- 性別: 男性
- 興味のある性別: 女性
- 年齢: 22-35歳（ランダム）

### 女性ユーザー（10人）
- メールアドレス: `female1@test.com` ～ `female10@test.com`
- パスワード: `test1234`（全員共通）
- ニックネーム: 花子、美咲、さくら、あかり、みゆき、ゆい、あや、まな、りん、なな
- 性別: 女性
- 興味のある性別: 男性
- 年齢: 20-32歳（ランダム）

---

## テストユーザーの削除

既存のテストユーザーを削除する場合：

### 方法1: 開発ページから削除
1. `http://localhost:3000/dev` にアクセス
2. 「テストユーザーを削除」ボタンをクリック

### 方法2: APIを直接呼び出す
```bash
curl -X POST https://your-app.vercel.app/api/dev/clear-test-users
```

---

## 注意事項

- テストユーザーは `@test.com` で終わるメールアドレスで識別されます
- 削除機能は `@test.com` で終わるすべてのユーザーを削除します
- 本番環境でも使用可能ですが、セキュリティ上の理由から必要に応じて制限してください

---

## ログイン方法

作成されたテストユーザーでログインする場合：

1. ログインページ（`/auth/login`）にアクセス
2. メールアドレスとパスワードを入力：
   - 例: `male1@test.com` / `test1234`
   - 例: `female1@test.com` / `test1234`

---

**最終更新**: 2025年1月
