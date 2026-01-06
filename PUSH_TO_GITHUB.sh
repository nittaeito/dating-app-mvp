#!/bin/bash

# GitHubリポジトリにプッシュするスクリプト

echo "=== GitHubリポジトリへのプッシュ開始 ==="

# 既存のリモートを削除（プレースホルダーが設定されている場合）
echo "1. 既存のリモートを削除..."
git remote remove origin 2>/dev/null || echo "リモートが存在しないか、既に削除済み"

# 正しいリモートURLを設定
echo "2. リモートURLを設定..."
git remote add origin https://github.com/nittaeito/dating-app-mvp.git

# リモート設定を確認
echo "3. リモート設定を確認..."
git remote -v

# すべてのファイルを追加
echo "4. すべてのファイルを追加..."
git add .

# 変更をコミット（変更がある場合）
echo "5. 変更をコミット..."
git commit -m "Add all project files for Vercel deployment" || echo "コミットする変更がありません"

# ブランチ名をmainに確認
echo "6. ブランチ名を確認..."
git branch -M main

# GitHubにプッシュ
echo "7. GitHubにプッシュ..."
git push -u origin main

echo "=== 完了 ==="
echo "次はVercelでこのリポジトリをインポートしてください！"

