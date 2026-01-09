-- StorageバケットのRLSポリシー設定
-- 独自認証システムを使用しているため、サービスロールキーでアクセス
-- ただし、Storageはクライアント側からもアクセスする可能性があるため、
-- パブリック読み取りを許可し、アップロードはサーバー側API経由のみ可能にする

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can upload own photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own photos" ON storage.objects;

-- 全員が写真を閲覧可能（パブリックバケットのため）
CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- 注意: アップロード・削除・更新はサーバー側API（createAdminClient使用）でのみ実行
-- クライアント側からの直接操作は許可しない
-- 必要に応じて、サービスロールキーを持つサーバーからのみ操作可能なポリシーを追加
