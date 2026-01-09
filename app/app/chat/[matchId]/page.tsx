"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { ProfileModal } from "@/components/chat/ProfileModal";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/types/message";
import toast from "react-hot-toast";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params.matchId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<{
    userId: string;
    nickname: string;
    age: number;
    mainPhoto: string | null;
  } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const channelRef = useRef<any>(null);

  const loadMatchInfo = useCallback(async () => {
    try {
      const res = await fetch(`/api/matches/${matchId}`);
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error?.message || "マッチング情報の取得に失敗しました");
        router.push("/app/matches");
        return;
      }

      setPartner(result.data.match.partner);
    } catch (error) {
      toast.error("通信エラーが発生しました");
    }
  }, [matchId, router]);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/messages/${matchId}`);
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error?.message || "メッセージの取得に失敗しました");
        return;
      }

      setMessages(result.data.messages || []);

      // 現在のユーザーIDを取得（最初のメッセージから推測、またはAPIから取得）
      if (result.data.messages && result.data.messages.length > 0) {
        const myMessage = result.data.messages.find((m: Message) => m.isMine);
        if (myMessage) {
          setCurrentUserId(myMessage.senderId);
        }
      }

      // 現在のユーザーIDを取得（/api/auth/meから）
      const meRes = await fetch("/api/auth/me");
      const meResult = await meRes.json();
      if (meResult.success) {
        setCurrentUserId(meResult.data.user.id);
      }
    } catch (error) {
      toast.error("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  const setupRealtime = useCallback(() => {
    if (!matchId || !currentUserId) return;

    const supabase = createClient();

    // 既存のチャンネルがあれば解除
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    const channel = supabase
      .channel(`match:${matchId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as any;
          setMessages((prev) => {
            // 重複チェック（より確実に）
            const exists = prev.find((m) => m.id === newMessage.id);
            if (exists) {
              return prev;
            }
            return [
              ...prev,
              {
                id: newMessage.id,
                matchId: newMessage.match_id,
                senderId: newMessage.sender_id,
                content: newMessage.content,
                readAt: newMessage.read_at || undefined,
                createdAt: newMessage.created_at,
                isMine: newMessage.sender_id === currentUserId,
              },
            ];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const updatedMessage = payload.new as any;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === updatedMessage.id
                ? {
                    ...m,
                    readAt: updatedMessage.read_at || undefined,
                  }
                : m
            )
          );
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime subscription active");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error");
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [matchId, currentUserId]);

  useEffect(() => {
    loadMatchInfo();
    loadMessages();
  }, [loadMatchInfo, loadMessages]);

  useEffect(() => {
    if (currentUserId) {
      const cleanup = setupRealtime();
      return cleanup;
    }
  }, [currentUserId, setupRealtime]);

  async function handleSend(content: string) {
    if (!content.trim() || isSending) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      matchId,
      senderId: currentUserId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    // 楽観的更新（即座に表示）
    setMessages((prev) => [...prev, optimisticMessage]);
    setIsSending(true);

    try {
      const res = await fetch(`/api/messages/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      const result = await res.json();

      if (!res.ok) {
        // エラー時は楽観的更新を元に戻す
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        toast.error(result.error?.message || "メッセージ送信に失敗しました");
        return;
      }

      // 楽観的更新を実際のメッセージに置き換え（Realtimeで追加される前に）
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempId);
        // Realtimeで追加されるので、重複チェックは不要だが念のため
        const exists = withoutTemp.find((m) => m.id === result.data.message.id);
        return exists
          ? withoutTemp
          : [
              ...withoutTemp,
              {
                id: result.data.message.id,
                matchId: result.data.message.matchId || matchId,
                senderId: result.data.message.senderId,
                content: result.data.message.content,
                createdAt: result.data.message.createdAt,
                isMine: true,
              },
            ];
      });
    } catch (error) {
      // エラー時は楽観的更新を元に戻す
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      toast.error("通信エラーが発生しました");
    } finally {
      setIsSending(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm p-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="text-xl">←</span>
        </button>
        {partner && (
          <>
            <button
              onClick={() => setShowProfileModal(true)}
              className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-200 to-purple-200 hover:opacity-90 transition-all hover:scale-105 shadow-md ring-2 ring-white"
            >
              {partner.mainPhoto ? (
                <Image
                  src={partner.mainPhoto}
                  alt={partner.nickname}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                  👤
                </div>
              )}
            </button>
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex-1 text-left hover:opacity-80 transition-opacity group"
            >
              <h1 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                {partner.nickname}, {partner.age}
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <span>👆</span>
                <span>タップしてプロフィールを見る</span>
              </p>
            </button>
          </>
        )}
      </div>

      {/* メッセージリスト */}
      <MessageList messages={messages} currentUserId={currentUserId} />

      {/* 入力エリア */}
      <MessageInput onSend={handleSend} isLoading={isSending} />

      {/* プロフィールモーダル */}
      {partner && (
        <ProfileModal
          userId={partner.userId}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}

