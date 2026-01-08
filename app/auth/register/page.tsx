import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10 px-4 my-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Join Us</h1>
          <p className="text-slate-400">Start your journey today</p>
        </div>

        <div className="glass-panel-dark p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
          <RegisterForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 mb-2">
              Already have an account?
            </p>
            <Link
              href="/auth/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors hover:underline decoration-2 underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/auth/login" className="text-sm text-slate-500 hover:text-slate-400 flex items-center justify-center gap-1 transition-colors">
            <span>←</span> Back
          </Link>
        </div>
      </div>
    </div>
  );
}
