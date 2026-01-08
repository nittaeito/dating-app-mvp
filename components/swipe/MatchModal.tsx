"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface MatchModalProps {
  isOpen: boolean;
  partner: {
    userId: string;
    nickname: string;
    age: number;
    mainPhoto: string | null;
  } | null;
  onSendMessage: () => void;
  onContinue: () => void;
}

export function MatchModal({
  isOpen,
  partner,
  onSendMessage,
  onContinue,
}: MatchModalProps) {
  if (!isOpen || !partner) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"
          onClick={onContinue}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm"
        >
          <div className="glass-panel-dark bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-3xl p-8 pt-12 overflow-hidden border-white/20">
            {/* Background Effects */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />

            <div className="text-center relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-8"
              >
                <h2 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-2xl">
                  IT&apos;S A<br />MATCH!
                </h2>
              </motion.div>

              <div className="flex items-center justify-center -space-x-4 mb-8">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-24 h-24 rounded-full border-4 border-slate-800 overflow-hidden relative z-10 shadow-xl"
                >
                  {/* Placeholder for current user self, implementing properly would require user context */}
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                </motion.div>

                <div className="z-20 w-12 h-12 bg-white text-pink-500 rounded-full flex items-center justify-center text-xl shadow-lg transform -rotate-12">
                  ♥
                </div>

                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-24 h-24 rounded-full border-4 border-slate-800 overflow-hidden relative z-10 shadow-xl"
                >
                  {partner.mainPhoto ? (
                    <Image
                      src={partner.mainPhoto}
                      alt={partner.nickname}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-700" />
                  )}
                </motion.div>
              </div>

              <div className="mb-8">
                <p className="text-white/80 text-lg">
                  You and <span className="font-bold text-white">{partner.nickname}</span><br />liked each other!
                </p>
              </div>

              <div className="space-y-4">
                <Button onClick={onSendMessage} className="w-full text-lg py-6" variant="premium">
                  Send Message
                </Button>
                <button
                  onClick={onContinue}
                  className="w-full py-3 text-slate-400 hover:text-white font-medium transition-colors"
                >
                  Keep Swiping
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
