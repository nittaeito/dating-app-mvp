import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { errorResponse, APIError } from "@/lib/utils/api";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      throw new APIError("UNAUTHORIZED", "認証が必要です", 401);
    }

    const { userId } = params;
    const supabase = createAdminClient();

    // マッチング関係を確認（チャットしている相手のプロフィールのみ取得可能）
    const { data: matches, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .or(`user1_id.eq.${session.userId},user2_id.eq.${session.userId}`);

    if (matchError) {
      throw new APIError("INTERNAL_ERROR", "マッチング情報の取得に失敗しました", 500);
    }

    // 現在のユーザーと指定されたユーザーがマッチングしているか確認
    const match = matches?.find(
      (m) =>
        (m.user1_id === session.userId && m.user2_id === userId) ||
        (m.user1_id === userId && m.user2_id === session.userId)
    );

    // マッチングがない場合はエラー
    if (matchError || !match) {
      throw new APIError(
        "FORBIDDEN",
        "このプロフィールにアクセスする権限がありません",
        403
      );
    }

    // プロフィール取得
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (profileError || !profile) {
      throw new APIError("NOT_FOUND", "プロフィールが見つかりません", 404);
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          nickname: profile.nickname,
          age: profile.age,
          birthdate: profile.birthdate,
          gender: profile.gender,
          bio: profile.bio,
          photoUrls: profile.photo_urls || [],
        },
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return errorResponse(error);
    }

    console.error("Get partner profile error:", error);
    return errorResponse(
      new APIError("INTERNAL_ERROR", "サーバーエラーが発生しました", 500)
    );
  }
}
