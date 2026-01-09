"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  type ProfileInput,
} from "@/lib/validation/schemas";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhotoUpload } from "@/components/profile/PhotoUpload";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { Profile } from "@/types/profile";

interface ProfileFormProps {
  initialData?: Profile;
  mode?: "create" | "edit";
}

export function ProfileForm({ initialData, mode = "create" }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    initialData?.photoUrls || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData
      ? {
          nickname: initialData.nickname,
          birthdate: initialData.birthdate,
          gender: initialData.gender,
          interestedIn: initialData.interestedIn,
          bio: initialData.bio,
          photoUrls: initialData.photoUrls,
        }
      : undefined,
  });

  useEffect(() => {
    setValue("photoUrls", photoUrls);
  }, [photoUrls, setValue]);

  async function onSubmit(data: ProfileInput) {
    if (photoUrls.length < 1) {
      toast.error("写真を最低1枚アップロードしてください");
      return;
    }

    setIsLoading(true);
    try {
      const url = mode === "create" ? "/api/profile" : "/api/profile";
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          photoUrls,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error?.details) {
          Object.values(result.error.details).forEach((msg: any) => {
            toast.error(String(msg));
          });
        } else {
          toast.error(result.error?.message || "保存に失敗しました");
        }
        return;
      }

      toast.success(
        mode === "create" ? "プロフィールを作成しました" : "プロフィールを更新しました"
      );
      if (mode === "create" && result.data.redirectTo) {
        router.push(result.data.redirectTo);
      } else {
        router.push("/app/profile");
      }
    } catch (error) {
      toast.error("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 写真セクション */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">📸</span>
          <span>写真 *</span>
        </label>
        <PhotoUpload photos={photoUrls} onChange={setPhotoUrls} />
        {errors.photoUrls && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            {errors.photoUrls.message}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">1-3枚の写真をアップロードしてください</p>
      </div>

      {/* 基本情報セクション */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">基本情報</h3>
        
        <Input
          {...register("nickname")}
          label="ニックネーム *"
          placeholder="2-20文字で入力してください"
          error={errors.nickname?.message}
        />

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            生年月日 *
          </label>
          <input
            {...register("birthdate")}
            type="date"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              errors.birthdate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.birthdate && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              {errors.birthdate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            性別 *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["male", "female", "other"] as const).map((gender) => (
              <label
                key={gender}
                className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                }`}
              >
                <input
                  {...register("gender")}
                  type="radio"
                  value={gender}
                  className="w-5 h-5 text-blue-500"
                />
                <span className="font-medium">
                  {gender === "male"
                    ? "男性"
                    : gender === "female"
                    ? "女性"
                    : "その他"}
                </span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              {errors.gender.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            興味のある性別 *（複数選択可）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["male", "female", "other", "all"] as const).map((interest) => (
              <label
                key={interest}
                className="flex items-center gap-2 p-3 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
              >
                <input
                  {...register("interestedIn")}
                  type="checkbox"
                  value={interest}
                  className="w-5 h-5 text-blue-500 rounded"
                />
                <span className="font-medium">
                  {interest === "male"
                    ? "男性"
                    : interest === "female"
                    ? "女性"
                    : interest === "other"
                    ? "その他"
                    : "すべて"}
                </span>
              </label>
            ))}
          </div>
          {errors.interestedIn && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              {errors.interestedIn.message}
            </p>
          )}
        </div>
      </div>

      {/* 自己紹介セクション */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
        <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">💬</span>
          <span>自己紹介</span>
        </label>
        <textarea
          {...register("bio")}
          rows={5}
          maxLength={500}
          placeholder="あなたのことを教えてください（500文字以内）"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none ${
            errors.bio ? "border-red-500" : "border-gray-300"
          }`}
        />
        <div className="flex justify-between items-center mt-2">
          {errors.bio ? (
            <p className="text-sm text-red-600 font-medium">
              {errors.bio.message}
            </p>
          ) : (
            <div />
          )}
          <p className="text-xs text-gray-500">
            {photoUrls.length > 0 && "bio" in register ? 
              (register("bio") as any).value?.length || 0 : 0}/500文字
          </p>
        </div>
      </div>

      {/* 送信ボタン */}
      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
      >
        {mode === "create" ? "✨ プロフィールを作成" : "💾 プロフィールを更新"}
      </Button>
    </form>
  );
}

