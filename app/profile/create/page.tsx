import { ProfileForm } from "@/components/profile/ProfileForm";

export default function ProfileCreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">プロフィール作成</h1>
          <p className="text-gray-600">あなたのプロフィールを完成させましょう</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <ProfileForm mode="create" />
        </div>
      </div>
    </div>
  );
}

