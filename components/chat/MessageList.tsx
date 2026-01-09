"use client";

import { useEffect, useRef, useMemo } from "react";
import type { Message } from "@/types/message";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

interface MessageGroup {
  date: string;
  messages: Message[];
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef(0);

  useEffect(() => {
    // 新しいメッセージが追加された時のみスクロール
    if (messages.length > previousMessagesLength.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    previousMessagesLength.current = messages.length;
  }, [messages.length]);

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "今日";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "昨日";
    } else {
      return date.toLocaleDateString("ja-JP", {
        month: "long",
        day: "numeric",
      });
    }
  }

  // メッセージを日付でグループ化
  const groupedMessages = useMemo(() => {
    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();
      
      if (!currentGroup || currentGroup.date !== messageDate) {
        currentGroup = {
          date: messageDate,
          messages: [],
        };
        groups.push(currentGroup);
      }
      currentGroup.messages.push(message);
    });

    return groups;
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {groupedMessages.map((group, groupIndex) => (
        <div key={group.date}>
          {/* 日付セパレーター */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
              {formatDate(group.messages[0].createdAt)}
            </div>
          </div>

          {/* メッセージ */}
          {group.messages.map((message) => {
            const isMine = message.isMine || message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex mb-3 ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                    isMine
                      ? "bg-blue-500 text-white rounded-br-sm"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
                  }`}
                >
                  <p className="break-words text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1.5">
                    <p
                      className={`text-xs ${
                        isMine ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                    {isMine && message.readAt && (
                      <span className="text-xs text-blue-100">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

