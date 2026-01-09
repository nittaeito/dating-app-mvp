import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validation/schemas";
import { errorResponse, APIError } from "@/lib/utils/api";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // 管理者権限のクライアントを使用（RLSをバイパス）
    let supabase;
    try {
      supabase = createAdminClient();
    } catch (clientError) {
      console.error("Supabase client creation error:", clientError);
      throw new APIError(
        "INTERNAL_ERROR",
        `Supabase接続エラー: ${clientError instanceof Error ? clientError.message : "Unknown error"}`,
        500
      );
    }

    // メールアドレス重複チェック
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", validated.email)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Email check error:", checkError);
      throw new APIError(
        "INTERNAL_ERROR",
        `メールアドレス確認に失敗しました: ${checkError.message}`,
        500
      );
    }

    if (existingUser) {
      throw new APIError(
        "CONFLICT",
        "このメールアドレスは既に登録されています",
        409
      );
    }

    // パスワードハッシュ化
    const passwordHash = await hashPassword(validated.password);

    // ユーザー作成
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email: validated.email,
        password_hash: passwordHash,
        email_verified: false,
        is_active: true,
      })
      .select()
      .single();

    if (userError) {
      console.error("User creation error:", userError);
      console.error("Error details:", JSON.stringify(userError, null, 2));
      console.error("Error code:", userError.code);
      console.error("Error hint:", userError.hint);
      
      // テーブルが存在しない場合のエラー
      if (userError.code === '42P01' || userError.message?.includes('does not exist')) {
        throw new APIError(
          "INTERNAL_ERROR",
          "データベーステーブルが存在しません。Supabaseでデータベーススキーマを適用してください。",
          500
        );
      }
      
      throw new APIError(
        "INTERNAL_ERROR",
        `ユーザー作成に失敗しました: ${userError.message || JSON.stringify(userError)}`,
        500
      );
    }

    // セッション作成
    await createSession(user.id);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
          },
          redirectTo: "/profile/create",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof APIError) {
      return errorResponse(error);
    }

    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse(
        new APIError(
          "VALIDATION_ERROR",
          "入力内容に誤りがあります",
          400,
          error
        )
      );
    }

    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "サーバーエラーが発生しました";
    return errorResponse(
      new APIError("INTERNAL_ERROR", errorMessage, 500)
    );
  }
}

