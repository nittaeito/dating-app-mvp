# API直接呼び出しとは？

## 📖 概要

「API直接呼び出し」とは、ブラウザの開発者ツール（デベロッパーツール）のコンソールから、JavaScriptコードを使って直接APIを実行する方法です。

通常はボタンをクリックして操作しますが、この方法を使うと、コードを書いて直接APIを呼び出すことができます。

---

## 🛠️ 使い方

### ステップ1: ブラウザの開発者ツールを開く

1. ブラウザでアプリを開く（例: `https://your-app.vercel.app`）
2. **F12キー**を押す（または右クリック → 「検証」）
3. **Console**タブをクリック

### ステップ2: コードを実行

Consoleタブに以下のコードをコピー&ペーストして、**Enterキー**を押します：

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
      console.log('✅ 成功:', data.data.message);
      console.log('📋 作成されたユーザー:', data.data.users);
    } else {
      console.error('❌ エラー:', data.error);
    }
  })
  .catch(error => {
    console.error('❌ 通信エラー:', error);
  });
```

### ステップ3: 結果を確認

Consoleに結果が表示されます：
- ✅ 成功した場合: 作成されたユーザーの情報が表示されます
- ❌ エラーの場合: エラーメッセージが表示されます

---

## 💡 なぜ使うの？

### メリット
- **開発・デバッグに便利**: ボタンをクリックする代わりに、コードで直接実行できる
- **自動化**: 複数の操作を一度に実行できる
- **テスト**: APIが正しく動作しているか確認できる

### デメリット
- **技術的な知識が必要**: JavaScriptの基本的な知識が必要
- **エラーが起きやすい**: コードを間違えるとエラーになる

---

## 📝 よく使う例

### テストユーザーを作成

```javascript
fetch('/api/dev/seed-users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ count: 10 })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### テストユーザーを削除

```javascript
fetch('/api/dev/clear-test-users', {
  method: 'POST'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### メッセージを送信（例）

```javascript
fetch('/api/messages/MATCH_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: 'こんにちは！' })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## ⚠️ 注意事項

1. **本番環境では注意**: 本番環境で実行すると、実際のデータが変更されます
2. **認証が必要な場合**: ログインしている必要があるAPIもあります
3. **エラーハンドリング**: エラーが発生した場合は、Consoleにエラーメッセージが表示されます

---

## 🎯 まとめ

- **API直接呼び出し** = ブラウザのConsoleからJavaScriptコードでAPIを実行する方法
- **使い方**: F12 → Consoleタブ → コードを貼り付け → Enter
- **用途**: 開発・デバッグ、テスト、自動化

**通常は開発ページ（`/dev`）のボタンを使う方が簡単です！**  
API直接呼び出しは、開発者向けの高度な機能です。

---

**最終更新**: 2025年1月
