"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function DevPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  async function handleSeedUsers() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dev/seed-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 10 }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error?.message || "テストユーザー作成に失敗しました");
        return;
      }

      toast.success(result.data.message);
      setUsers(result.data.users || []);
    } catch (error) {
      toast.error("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleClearUsers() {
    if (!confirm("すべてのテストユーザーを削除しますか？")) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/dev/clear-test-users", {
        method: "POST",
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error?.message || "テストユーザー削除に失敗しました");
        return;
      }

      toast.success(result.data.message);
      setUsers([]);
    } catch (error) {
      toast.error("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">開発用ツール</h1>
          <p className="text-gray-600">テストユーザーの作成・管理</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-gray-100">
          {/* テストユーザー作成 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                👥
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">テストユーザー作成</h2>
                <p className="text-sm text-gray-600 mb-4">
                  男性10人、女性10人のテストユーザーを作成します。
                  <br />
                  <span className="font-medium text-gray-700">パスワードはすべて「test1234」です。</span>
                </p>
                <Button
                  onClick={handleSeedUsers}
                  isLoading={isLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  {isLoading ? "作成中..." : "✨ テストユーザーを作成（男女10人ずつ）"}
                </Button>
              </div>
            </div>
          </div>

          {/* テストユーザー削除 */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                🗑️
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">テストユーザー削除</h2>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium text-red-600">@test.com</span>で終わるメールアドレスのユーザーをすべて削除します。
                </p>
                <Button
                  onClick={handleClearUsers}
                  isLoading={isLoading}
                  variant="danger"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  {isLoading ? "削除中..." : "🗑️ テストユーザーを削除"}
                </Button>
              </div>
            </div>
          </div>

          {/* 作成されたユーザー一覧 */}
          {users.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>✅</span>
                <span>作成されたユーザー ({users.length}人)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      <span>{user.nickname}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-600 flex items-center gap-2">
                        <span className="text-xs">📧</span>
                        <span className="font-mono">{user.email}</span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-2">
                        <span className="text-xs">🔑</span>
                        <span className="font-mono font-semibold">{user.password}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 使い方説明 */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📖 使い方</h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm text-gray-700">
              <p><strong>1. テストユーザー作成:</strong> 上記のボタンをクリックすると、男女各10人のテストユーザーが作成されます。</p>
              <p><strong>2. ログイン:</strong> 作成されたメールアドレスとパスワード（test1234）でログインできます。</p>
              <p><strong>3. 削除:</strong> 不要になったテストユーザーは削除ボタンで一括削除できます。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

