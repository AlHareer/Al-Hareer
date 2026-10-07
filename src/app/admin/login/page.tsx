'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ShieldCheck, Sparkles, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { adminLogin, type AdminLoginState } from '@/actions/auth';

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<AdminLoginState, FormData>(adminLogin, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-cream-100 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-gold/10 blur-[150px]" />
        <div className="absolute -bottom-[10%] right-[-20%] w-[600px] h-[600px] rounded-full bg-brand-700/5 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-cream-300 shadow-luxury-lg p-8 sm:p-12">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold rounded-t-2xl" />

        <div className="relative mb-8 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white shadow-luxury mb-4">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-brand-700 tracking-wide">
            Admin <span className="text-gold-dark">Login</span>
          </h1>
          <p className="mt-2 text-sm text-muted flex items-center gap-1.5 justify-center">
            Al Hareer dashboard &mdash; authorized users only
          </p>
          <div className="w-14 h-px bg-gold mt-5" />
        </div>

        <form action={formAction} className="relative space-y-4">
          {state?.error && (
            <div className="rounded-xl border border-[#CFAC64] bg-[#F6F1EC] p-3.5 text-sm text-[#024F5F] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#024F5F] shrink-0" />
              {state.error}
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400 group-focus-within:text-brand-600 transition-colors" />
            <input
              required
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full rounded-xl border border-cream-300 bg-cream-50 pl-12 pr-5 py-3.5 text-sm text-brand-700 placeholder:text-muted-light transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500/20"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400 group-focus-within:text-brand-600 transition-colors" />
            <input
              required
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full rounded-xl border border-cream-300 bg-cream-50 pl-12 pr-12 py-3.5 text-sm text-brand-700 placeholder:text-muted-light transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-light hover:text-brand-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-2 bg-[#CFAC64] hover:bg-[#B08F4F] text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide shadow-luxury transition-all disabled:opacity-60"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Checking Details...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Sign In
              </span>
            )}
          </button>
        </form>

        <div className="relative mt-8 text-center border-t border-cream-300 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-muted hover:text-brand-600 transition-colors uppercase"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
