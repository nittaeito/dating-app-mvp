"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SwipeCard } from "@/components/swipe/SwipeCard";
import { MatchModal } from "@/components/swipe/MatchModal";
import { Button } from "@/components/ui/Button";
import { TabNavigation } from "@/components/layout/TabNavigation";
import toast from "react-hot-toast";

interface Candidate {
  userId: string;
  nickname: string;
  age: number;
  gender: string;
  bio?: string;
  photoUrls: string[];
}

export default function SwipePage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [matchedUser, setMatchedUser] = useState<{
    userId: string;
    nickname: string;
    age: number;
    mainPhoto: string | null;
  } | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/swipe/candidates?limit=10");
      const result = await res.json();

      if (!res.ok) {
        // toast.error(result.error?.message || "候補の取得に失敗しました");
        // Silently fail or retry, or show empty state
        setCandidates([]);
        return;
      }

      setCandidates(result.data.candidates || []);
    } catch (error) {
      toast.error("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLike() {
    if (currentIndex >= candidates.length) return;

    const candidate = candidates[currentIndex];
    try {
      const res = await fetch("/api/swipe/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: candidate.userId }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error?.message || "いいねに失敗しました");
        return;
      }

      if (result.data.matched) {
        setMatchedUser(result.data.partner);
        setMatchId(result.data.matchId);
        setShowMatchModal(true);
      }

      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      toast.error("通信エラーが発生しました");
    }
  }

  async function handleSkip() {
    if (currentIndex >= candidates.length) return;

    const candidate = candidates[currentIndex];
    try {
      const res = await fetch("/api/swipe/skip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: candidate.userId }),
      });

      if (!res.ok) {
        const result = await res.json();
        toast.error(result.error?.message || "スキップに失敗しました");
        return;
      }

      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      toast.error("通信エラーが発生しました");
    }
  }

  function handleSendMessage() {
    if (matchId) {
      router.push(`/app/chat/${matchId}`);
    }
    setShowMatchModal(false);
  }

  function handleContinue() {
    setShowMatchModal(false);
    setMatchedUser(null);
    setMatchId(null);
  }

  useEffect(() => {
    if (currentIndex >= candidates.length && candidates.length > 0) {
      loadCandidates();
      setCurrentIndex(0);
    }
  }, [currentIndex, candidates.length]);

  const visibleCandidates = candidates.slice(currentIndex, currentIndex + 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Finding prospects...</p>
        </div>
        <TabNavigation />
      </div>
    );
  }

  if (!candidates[currentIndex]) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 pb-20">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/10">
          <span className="text-4xl">✨</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No more profiles</h2>
        <p className="text-slate-400 mb-8 text-center max-w-xs">You&apos;ve seen everyone nearby. check back later for new people.</p>

        <Button onClick={() => router.push("/app/matches")} variant="outline" className="min-w-[200px]">
          View Matches
        </Button>
        <TabNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative h-[calc(100vh-80px)] w-full max-w-md mx-auto flex flex-col pt-4">
        {/* Card Stack */}
        <div className="flex-1 relative w-full px-4 mb-24">
          {visibleCandidates.map((candidate, index) => (
            <SwipeCard
              key={candidate.userId}
              user={candidate}
              onLike={handleLike}
              onSkip={handleSkip}
              index={index}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8 z-50">
          <button
            onClick={handleSkip}
            className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 shadow-xl flex items-center justify-center text-3xl text-red-500 hover:scale-110 hover:bg-slate-700 transition-all duration-200 active:scale-95"
            aria-label="Skip"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={handleLike}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 shadow-xl shadow-indigo-500/40 flex items-center justify-center text-4xl text-white hover:scale-110 hover:shadow-indigo-500/60 transition-all duration-200 active:scale-95"
            aria-label="Like"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </button>
        </div>
      </div>

      <MatchModal
        isOpen={showMatchModal}
        partner={matchedUser}
        onSendMessage={handleSendMessage}
        onContinue={handleContinue}
      />

      <TabNavigation />
    </div>
  );
}
