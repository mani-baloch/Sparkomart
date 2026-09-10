import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | SparkoMart",
  description: "Read SparkoMart's Privacy Policy and understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sticky Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Back to Sign Up Button at Top */}
        <div className="mb-6">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-black bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl transition-all shadow-2xs group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Sign Up</span>
          </Link>
        </div>

        {/* Title & Date Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Last Updated: June 22, 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              1. Introduction
            </h2>
            <p>
              Welcome to SparkoMart. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy policy, or our practices with regard to your personal information, please contact us at info@SparkoMart.com.
            </p>
            <p>
              This privacy policy describes how we might use your information if you visit our website or make a purchase from us.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              2. Information We Collect
            </h2>
            <p>
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Register on the website</li>
              <li>Make a purchase</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us for customer support</li>
              <li>Use our website features</li>
            </ul>
            <p className="pt-1">
              The personal information we collect may include: name, email address, phone number, billing address, shipping address, payment information, and any other information you choose to provide.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              3. How We Use Your Information
            </h2>
            <p>
              We use your personal information for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your account or transactions</li>
              <li>Send you marketing and promotional communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              4. Information Sharing
            </h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Service providers who assist us in operating our website and conducting business</li>
              <li>Payment processors for secure transaction processing</li>
              <li>Shipping companies for order fulfillment</li>
              <li>Legal compliance when required by law</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              5. Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              6. Cookies and Tracking
            </h2>
            <p>
              Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              7. Your Rights
            </h2>
            <p>
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Access your personal information</li>
              <li>Update or correct your information</li>
              <li>Delete your account and personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              8. Children&apos;s Privacy
            </h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided personal information, please contact us immediately.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4 pt-2">
            <h2 className="text-base font-bold text-gray-900">
              10. Contact Information
            </h2>
            <p>
              If you have any questions about this privacy policy, please contact us:
            </p>

            {/* Contact Box */}
            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-5 space-y-1 text-xs sm:text-sm text-gray-800">
              <div>
                <span className="font-bold">Email:</span>{" "}
                <a
                  href="mailto:info@SparkoMart.com"
                  className="text-gray-900 hover:text-[#F26E22] transition-colors"
                >
                  info@SparkoMart.com
                </a>
              </div>
              <div>
                <span className="font-bold">Phone:</span>{" "}
                <a
                  href="tel:+15123565110"
                  className="text-gray-900 hover:text-[#F26E22] transition-colors"
                >
                  +1 512-356-5110
                </a>
              </div>
              <div>
                <span className="font-bold">Address:</span> 5800 BALCONES DR 23935, AUSTIN TX 78731
              </div>
            </div>
          </section>

          {/* Bottom Back to Sign Up Banner */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/70 p-6 rounded-2xl border border-gray-200/70">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Ready to complete your registration?
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Return to the create account page to finish setting up your SparkoMart account.
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign Up</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
