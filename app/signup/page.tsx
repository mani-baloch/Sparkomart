"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Mail,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RotateCw,
} from "lucide-react";

export default function CreateAccountPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, sendSignUpOtp, verifySignUpOtp, resendSignUpOtp } =
    useCustomerAuth();

  // Registration step: "form" | "otp"
  const [step, setStep] = useState<"form" | "otp">("form");

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP Fields
  const [otpCode, setOtpCode] = useState("");
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect to profile
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/profile");
    }
  }, [isAuthenticated, isLoading, router]);

  // Resend OTP countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Handle Step 1: Submit Registration Form & Send OTP
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-check.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setSubmitting(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || firstName.trim();
      const res = await sendSignUpOtp(
        email,
        password,
        fullName,
        firstName.trim(),
        lastName.trim()
      );

      if (res.success) {
        setOtpPreview(res.otpCode || null);
        setStep("otp");
        setResendTimer(30);
        setCanResend(false);
        setSuccessMsg(`Verification code sent to ${email}. Please check your inbox.`);
      } else {
        setErrorMsg(res.error || "Failed to send verification code.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Step 2: Verify OTP and Open Account
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanOtp = otpCode.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await verifySignUpOtp(email, cleanOtp);
      if (res.success) {
        setSuccessMsg("Email verified successfully! Opening your account...");
        setTimeout(() => {
          router.replace("/profile");
        }, 1200);
      } else {
        setErrorMsg(res.error || "Invalid verification code. Please try again.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Verification error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const res = await resendSignUpOtp(email);
      if (res.success) {
        setOtpPreview(res.otpCode || null);
        setResendTimer(30);
        setCanResend(false);
        setSuccessMsg(`New verification code sent to ${email}.`);
      } else {
        setErrorMsg(res.error || "Failed to resend code.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to resend verification code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Sticky Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[490px] bg-white rounded-[28px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-8 sm:p-10 my-8 sm:my-12 animate-in fade-in zoom-in-95 duration-200">
          {/* STEP 1: Registration Form */}
          {step === "form" && (
            <>
              {/* Heading & Subtitle */}
              <div className="text-center mb-7">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Create Account
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  Join SparkoMart and discover premium products
                </p>
              </div>

              {/* Success Banner */}
              {successMsg && (
                <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-700 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div className="font-medium">{successMsg}</div>
                </div>
              )}

              {/* Error Banner */}
              {errorMsg && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-600 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <div className="font-medium">{errorMsg}</div>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* First & Last Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shams"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B] focus:ring-2 focus:ring-[#F2B52B]/20 transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Din"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B] focus:ring-2 focus:ring-[#F2B52B]/20 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Email Address Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B] focus:ring-2 focus:ring-[#F2B52B]/20 transition-all placeholder:text-gray-400"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    A 6-digit verification code will be sent to this email.
                  </p>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B] focus:ring-2 focus:ring-[#F2B52B]/20 transition-all placeholder:text-gray-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B] focus:ring-2 focus:ring-[#F2B52B]/20 transition-all placeholder:text-gray-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#F2B52B] border-gray-300 rounded focus:ring-[#F2B52B] cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-gray-900 font-semibold underline hover:text-[#F2B52B]"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-gray-900 font-semibold underline hover:text-[#F2B52B]"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3 bg-[#F2B52B] hover:bg-[#d99f20] text-gray-950 font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{submitting ? "Sending verification code..." : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Footer Login Link */}
              <div className="mt-7 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-gray-950 font-bold hover:underline transition-all"
                >
                  Sign In
                </Link>
              </div>
            </>
          )}

          {/* STEP 2: Email OTP Verification Screen */}
          {step === "otp" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-200">
              {/* Top Icon */}
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto mb-5 text-[#F2B52B] shadow-xs">
                <Mail className="w-8 h-8 stroke-[1.8]" />
              </div>

              {/* Title & Email */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-black text-gray-950 tracking-tight">
                  Verify Your Email
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                  We have sent a 6-digit verification code to:
                  <br />
                  <span className="font-bold text-gray-900">{email}</span>
                </p>
              </div>

              {/* Test Code Badge */}
              {otpPreview && (
                <div className="mb-5 p-3 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between text-xs text-blue-900">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Verification Code: <strong className="text-sm font-mono tracking-wider font-black text-blue-950">{otpPreview}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpCode(otpPreview)}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-950 underline cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {/* Success Banner */}
              {successMsg && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-700 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div className="font-medium">{successMsg}</div>
                </div>
              )}

              {/* Error Banner */}
              {errorMsg && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <div className="font-medium">{errorMsg}</div>
                </div>
              )}

              {/* OTP Form */}
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center font-mono text-2xl tracking-[0.4em] py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#F2B52B] focus:bg-white focus:ring-4 focus:ring-[#F2B52B]/20 transition-all font-black text-gray-900 placeholder:text-gray-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || otpCode.length < 6}
                  className="w-full py-3.5 bg-[#F2B52B] hover:bg-[#d99f20] text-gray-950 font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{submitting ? "Verifying code..." : "Verify & Open Account"}</span>
                </button>
              </form>

              {/* Resend Code Row */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">Didn&apos;t get the code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={submitting}
                    className="font-bold text-gray-900 hover:text-[#B47C05] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Resend Code</span>
                  </button>
                ) : (
                  <span className="text-gray-400 font-medium">
                    Resend in {resendTimer}s
                  </span>
                )}
              </div>

              {/* Change email button */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change email address</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
