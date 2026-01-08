"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";

interface SwipeCardProps {
  user: {
    userId: string;
    nickname: string;
    age: number;
    gender: string;
    bio?: string;
    photoUrls: string[];
  };
  onLike: () => void;
  onSkip: () => void;
  index: number;
}

export function SwipeCard({ user, onLike, onSkip, index }: SwipeCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Stamp animations
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-10, -100], [0, 1]);

  function handleDragEnd(
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onLike();
    } else if (info.offset.x < -threshold) {
      onSkip();
    }
  }

  function handleDrag(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.x > 50) {
      setDragDirection("right");
    } else if (info.offset.x < -50) {
      setDragDirection("left");
    } else {
      setDragDirection(null);
    }
  }

  function nextPhoto(e: React.MouseEvent) {
    e.stopPropagation();
    if (user.photoUrls.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % user.photoUrls.length);
    }
  }

  function prevPhoto(e: React.MouseEvent) {
    e.stopPropagation();
    if (user.photoUrls.length > 1) {
      setCurrentPhotoIndex(
        (prev) => (prev - 1 + user.photoUrls.length) % user.photoUrls.length
      );
    }
  }

  const isFront = index === 0;

  return (
    <motion.div
      className="absolute w-full max-w-sm mx-auto cursor-grab active:cursor-grabbing"
      style={{
        zIndex: 100 - index,
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        scale: 1 - index * 0.05,
        y: index * 10,
        opacity: isFront ? opacity : 1 - index * 0.2,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10 h-[600px]">
        {/* Photo Carousel */}
        <div className="relative h-full w-full">
          {user.photoUrls[currentPhotoIndex] ? (
            <Image
              src={user.photoUrls[currentPhotoIndex]}
              alt={`${user.nickname}`}
              fill
              className="object-cover pointer-events-none"
              priority={index <= 1}
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <span className="text-slate-500">No Image</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

          {/* Photo Indicators */}
          {user.photoUrls.length > 1 && (
            <div className="absolute top-4 left-0 right-0 gap-1.5 flex justify-center px-4 z-20">
              {user.photoUrls.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full backdrop-blur-sm transition-all duration-300 ${i === currentPhotoIndex ? "bg-white" : "bg-white/30"
                    }`}
                />
              ))}
            </div>
          )}

          {/* Stamps */}
          {isFront && (
            <>
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-10 left-10 transform -rotate-12 border-4 border-green-400 rounded-xl px-4 py-2 z-10 box-border"
              >
                <span className="text-4xl font-black text-green-400 uppercase tracking-widest drop-shadow-md">LIKE</span>
              </motion.div>
              <motion.div
                style={{ opacity: nopeOpacity }}
                className="absolute top-10 right-10 transform rotate-12 border-4 border-red-500 rounded-xl px-4 py-2 z-10"
              >
                <span className="text-4xl font-black text-red-500 uppercase tracking-widest drop-shadow-md">NOPE</span>
              </motion.div>
            </>
          )}

          {/* Touch Navigation Layer */}
          <div className="absolute inset-0 flex z-10">
            <div className="w-1/2 h-full" onClick={prevPhoto} />
            <div className="w-1/2 h-full" onClick={nextPhoto} />
          </div>

          {/* User Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
            <div className="flex items-end gap-3 mb-2">
              <h2 className="text-4xl font-bold text-white tracking-tight">
                {user.nickname}
              </h2>
              <span className="text-2xl font-medium text-white/90 mb-1">{user.age}</span>
            </div>

            {user.bio && (
              <p className="text-white/80 line-clamp-3 text-sm leading-relaxed font-light drop-shadow-md">
                {user.bio}
              </p>
            )}

            {/* Action Hints */}
            <div className="mt-4 flex gap-4 opacity-50 text-xs text-white/70 uppercase tracking-widest font-semibold">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">↩</span>
                Pass
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">♥</span>
                Like
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
