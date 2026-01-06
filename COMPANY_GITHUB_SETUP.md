# 会社用GitHubアカウントへの移行手順

## ステップ1: 会社用GitHubアカウントでリポジトリを作成

1. **会社用GitHubアカウント（info@keyron-dx.jp）でログイン**
2. 右上の **「+」** ボタン → **「New repository」** をクリック
3. リポジトリ設定：
   - **Repository name**: `dating-app-mvp` (お好みの名前)
   - **Description**: (任意) マッチングアプリ MVP
   - **Public** または **Private** を選択
   - **⚠️ 重要**: 「Add a README file」「Add .gitignore」「Choose a license」は**チェックしない**
4. **「Create repository」** をクリック

## ステップ2: リモートURLを変更してプッシュ

会社用のGitHubアカウントでリポジトリを作成したら、以下のコマンドを実行：

```bash
# 1. 既存のリモートを削除
git remote remove origin

# 2. 会社用のGitHubリポジトリURLを設定
# ⚠️ 以下は例です。実際の会社用アカウントのユーザー名/組織名に置き換えてください
git remote add origin https://github.com/会社のユーザー名または組織名/dating-app-mvp.git

# 3. リモート設定を確認
git remote -v

# 4. すべてのファイルを追加（変更がある場合）
git add .

# 5. 変更をコミット（変更がある場合）
git commit -m "Initial commit for company repository"

# 6. 会社用のGitHubにプッシュ
git push -u origin main
```

## 認証について

会社用のGitHubアカウントでプッシュする場合、認証が必要です：

### 方法1: Personal Access Token（推奨）

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token (classic)」をクリック
3. スコープで `repo` にチェック
4. トークンを生成してコピー
5. プッシュ時にパスワードの代わりにトークンを入力

### 方法2: SSH鍵を使用

```bash
# SSH URLを使用する場合
git remote set-url origin git@github.com:会社のユーザー名または組織名/dating-app-mvp.git
```

## 注意事項

- 会社用のGitHubアカウントのユーザー名または組織名を確認してください
- リポジトリがPrivateの場合、適切な権限が必要です

