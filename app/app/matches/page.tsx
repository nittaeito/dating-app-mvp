import { MatchList } from "@/components/match/MatchList";
import { TabNavigation } from "@/components/layout/TabNavigation";

export default function MatchesPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="p-6">
          <h1 className="text-3xl font-black tracking-tight text-white mb-6">Matches</h1>
          <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
            <MatchList />
          </div>
        </div>
      </div>
      <TabNavigation />
    </div>
  );
}
