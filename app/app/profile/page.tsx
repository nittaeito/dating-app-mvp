"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TabNavigation } from "@/components/layout/TabNavigation";
import type { Profile } from "@/types/profile";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile");
      const result = await res.json();

      if (!res.ok) {
        if (result.error?.code === "NOT_FOUND") {
          router.push("/profile/create");
          return;
        }
        toast.error(result.error?.message || "プロフィールの取得に失敗しました");
        return;
      }

      setProfile(result.data.profile);
    } catch (error) {
      toast.error("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const result = await res.json();

      if (res.ok) {
        router.push("/auth/login");
      } else {
        toast.error(result.error?.message || "ログアウトに失敗しました");
      }
    } catch (error) {
      toast.error("通信エラーが発生しました");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="glass-panel-dark m-4 p-6 rounded-3xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <Button onClick={() => router.push("/profile/edit")} variant="outline" size="sm">
              Edit
            </Button>
          </div>

          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 relative">
                {profile.photoUrls[0] ? (
                  <Image src={profile.photoUrls[0]} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-2xl">👤</span>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.nickname}</h2>
              <div className="flex items-center gap-2 text-slate-400 mt-1">
                <span>{profile.age} years old</span>
                <span>•</span>
                <span>{profile.gender === 'male' ? 'Male' : 'Female'}</span>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {profile.photoUrls.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-white/5 shadow-inner group">
                <Image
                  src={url}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
            {/* Add placeholder slots if less than 6 photos maybe? skipping for now */}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-8 p-4 bg-slate-900/50 rounded-2xl border border-white/5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">About Me</h3>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => router.push("/terms")}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors text-slate-300"
            >
              <span>Terms of Service</span>
              <span className="text-slate-600">→</span>
            </button>
            <button
              onClick={() => router.push("/privacy")}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors text-slate-300"
            >
              <span>Privacy Policy</span>
              <span className="text-slate-600">→</span>
            </button>

            <div className="pt-4 mt-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full p-4 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors font-medium text-left flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <TabNavigation />
    </div>
  );
}
