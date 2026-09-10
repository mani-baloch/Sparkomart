"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/services/newsletter";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await subscribeToNewsletter(email.trim());
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className="w-full bg-[#F2B52B] py-16 md:py-20 text-center">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mb-3">
          Stay In Style
        </h2>
        <p className="text-gray-900 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
          Subscribe to our newsletter and be the first to know about new
          arrivals, exclusive offers, and style tips.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium shadow-md animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-5 h-5 text-[#F2B52B]" />
            <span>Thank you for subscribing to SparkoMart!</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <div className="relative w-full sm:flex-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black border-0 shadow-sm"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors duration-200 shrink-0 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
