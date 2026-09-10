"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setErrorMsg("");
    setSubmitting(true);

    // Simulate password recovery dispatch
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Sticky Top Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[440px] bg-white rounded-[28px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-8 sm:p-10 my-8 sm:my-12 animate-in fade-in zoom-in-95 duration-200">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                Check Your Email
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                We have sent password reset instructions to{" "}
                <strong className="text-gray-900 font-semibold">{email}</strong>.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="w-full py-3 bg-[#F2B52B] hover:bg-[#e0a41d] text-gray-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Heading & Subtitle */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#F2B52B] flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h1 className="text-2xl sm:text-[26px] font-black text-gray-950 tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  No worries, enter your account email and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-6 p-3.5 bg-red-50/80 border border-red-200/80 rounded-2xl flex items-center gap-2.5 text-red-700 text-xs animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-gray-800 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F2B52B]/40 focus:border-[#F2B52B] focus:bg-white transition-all"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3 bg-[#F2B52B] hover:bg-[#e0a41d] active:scale-[0.99] text-gray-950 font-bold text-sm rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Sending Reset Link..." : "Send Reset Link"}
                </button>
              </form>

              {/* Back to login */}
              <div className="mt-8 text-center pt-6 border-t border-gray-100">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
