"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface ProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileData {
  nickname: string;
  age: number;
  gender: string;
  bio?: string;
  photoUrls: string[];
  birthdate: string;
}

export function ProfileModal({ userId, isOpen, onClose }: ProfileModalProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (isOpen && userId) {
      loadProfile();
    }
  }, [isOpen, userId]);

  async function loadProfile() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/profile/partner/${userId}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setProfile(result.data.profile);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">プロフィール</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">読み込み中...</p>
            </div>
          ) : profile ? (
            <>
              {/* 写真カルーセル */}
              <div className="relative w-full h-96 rounded-xl overflow-hidden mb-6 bg-gray-100">
                {profile.photoUrls && profile.photoUrls.length > 0 ? (
                  <>
                    <Image
                      src={profile.photoUrls[currentPhotoIndex]}
                      alt={profile.nickname}
                      fill
                      className="object-cover"
                      priority
                    />
                    {profile.photoUrls.length > 1 && (
                      <>
                        {/* 写真インジケーター */}
                        <div className="absolute top-4 left-0 right-0 flex justify-center gap-2">
                          {profile.photoUrls.map((_, index) => (
                            <div
                              key={index}
                              className={`h-1 rounded-full transition-all ${
                                index === currentPhotoIndex
                                  ? "bg-white w-8"
                                  : "bg-white/50 w-1"
                              }`}
                            />
                          ))}
                        </div>
                        {/* 前の写真 */}
                        <button
                          onClick={() =>
                            setCurrentPhotoIndex(
                              (prev) =>
                                (prev - 1 + profile.photoUrls.length) %
                                profile.photoUrls.length
                            )
                          }
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-800"
                        >
                          ←
                        </button>
                        {/* 次の写真 */}
                        <button
                          onClick={() =>
                            setCurrentPhotoIndex(
                              (prev) => (prev + 1) % profile.photoUrls.length
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-800"
                        >
                          →
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-6xl">👤</span>
                  </div>
                )}
              </div>

              {/* 基本情報 */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {profile.nickname}, {profile.age}
                  </h3>
                  <p className="text-gray-500 capitalize">
                    {profile.gender === "male"
                      ? "男性"
                      : profile.gender === "female"
                      ? "女性"
                      : "その他"}
                  </p>
                </div>

                {/* 自己紹介 */}
                {profile.bio && (
                  <div>
                    <h4 className="font-semibold mb-2">自己紹介</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">プロフィールを取得できませんでした</p>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <Button onClick={onClose} className="w-full">
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
}
