"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login API call by setting an auth cookie for 24 hours
    document.cookie = "auth_session=true; path=/; max-age=86400";
    router.push("/home");
  };

  const handleGuestLogin = () => {
    // Set a guest cookie for 24 hours
    document.cookie = "guest_session=true; path=/; max-age=86400";
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-deep">
      {/* Global Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 hero-glow opacity-80"></div>
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-cyber/10 blur-[150px] rounded-full -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-violet/10 blur-[120px] rounded-full translate-y-1/2"></div>
      </div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-20">
        {/* Floating geometric elements for aesthetics */}
        <div className="absolute top-1/3 left-20 w-32 h-32 border border-cyber/20 rounded-full animate-float hidden lg:block"></div>
        <div className="absolute bottom-1/3 right-20 w-40 h-40 border border-violet/20 rounded-full animate-float hidden lg:block" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/4 right-32 w-16 h-16 border border-white/10 rounded-full animate-float hidden lg:block" style={{ animationDelay: "1s" }}></div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-outfit text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Welcome <span className="text-cyber">Back</span>
            </h1>
            <p className="text-slate-400 font-inter">
              Log in to continue planning your next intelligent journey.
            </p>
          </div>

          {/* Login Card */}
          <div className="glass rounded-2xl p-8 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-deep/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyber focus:ring-1 focus:ring-cyber transition-all duration-300"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <Link href="#" className="text-sm text-cyber hover:text-white transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <input 
                  type="password" 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-deep/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyber focus:ring-1 focus:ring-cyber transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-lg border border-transparent hover:bg-transparent hover:text-white hover:border-cyber hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all duration-300 transform group-hover:-translate-y-1"
              >
                Sign In
              </button>

              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Or continue with</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => signIn("google", { callbackUrl: "/home" })}
                  className="flex items-center justify-center space-x-2 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium text-slate-300 hover:text-white cursor-pointer group/social"
                >
                  <svg className="w-5 h-5 group-hover/social:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Google</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => signIn("github", { callbackUrl: "/home" })}
                  className="flex items-center justify-center space-x-2 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium text-slate-300 hover:text-white cursor-pointer group/social"
                >
                  <svg className="w-5 h-5 text-white group-hover/social:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </form>
          </div>
          
          <p className="text-center mt-8 text-sm text-slate-400">
            Don't want to create an account?{' '}
            <button 
              onClick={handleGuestLogin}
              className="text-white font-semibold hover:text-cyber transition-colors bg-transparent border-none cursor-pointer"
            >
              Continue as Guest
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
