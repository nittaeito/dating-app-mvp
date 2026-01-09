-- 独自認証システムを使用しているため、RLSを無効化
-- 認証制御はAPIルート側（createAdminClient使用）で行う

-- RLSを無効化（既存のポリシーを削除してから無効化）
DROP POLICY IF EXISTS "Users can view own record" ON users;
DROP POLICY IF EXISTS "Anyone can create user" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;
DROP POLICY IF EXISTS "Anyone can view active profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own swipes" ON swipes;
DROP POLICY IF EXISTS "Users can create own swipes" ON swipes;
DROP POLICY IF EXISTS "Users can view own matches" ON matches;
DROP POLICY IF EXISTS "Users can view messages in own matches" ON messages;
DROP POLICY IF EXISTS "Users can send messages in own matches" ON messages;
DROP POLICY IF EXISTS "Users can update received messages" ON messages;

-- RLSを無効化
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE swipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
