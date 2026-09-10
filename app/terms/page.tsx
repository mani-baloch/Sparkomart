import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | SparkoMart",
  description: "Review SparkoMart's Terms of Service governing the use of our website, catalog, orders, and services.",
};

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Last updated: June 22, 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing and using SparkoMart website, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service (&quot;Terms&quot;) govern your use of our website and services.
            </p>
            <p>
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              2. Description of Service
            </h2>
            <p>
              SparkoMart provides an online e-commerce platform for purchasing fashion items including clothing, accessories, and perfumes. Our services include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Online catalog browsing</li>
              <li>Product purchasing and checkout</li>
              <li>User account management</li>
              <li>Customer support services</li>
              <li>Newsletter and promotional communications</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              3. User Account and Registration
            </h2>
            <p>
              To access certain features of our service, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Keep your password confidential and secure</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">
              4. Orders and Payment
            </h2>

            <div className="space-y-3 pl-1">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">4.1 Order Process</h3>
                <p>
                  When you place an order, you are making an offer to purchase products. All orders are subject to acceptance by us. We reserve the right to refuse or cancel any order for any reason.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-1">4.2 Pricing</h3>
                <p>
                  All prices are displayed in US Dollars (USD) and are subject to change without notice. We reserve the right to modify prices at any time.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-1">4.3 Payment</h3>
                <p>
                  Payment must be made at the time of order placement. We accept various payment methods as indicated on our website. All payment information is processed securely.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              5. Shipping and Delivery
            </h2>
            <p>
              We will make every effort to deliver products within the estimated timeframe. However, delivery dates are estimates and not guaranteed. Shipping costs and delivery times may vary based on location and product availability.
            </p>
            <p>
              Risk of loss and title for products pass to you upon delivery to the shipping carrier.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              6. Returns and Refunds
            </h2>
            <p>
              We want you to be satisfied with your purchase. Our return policy includes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Returns must be initiated within 30 days of delivery</li>
              <li>Items must be unused and in original packaging</li>
              <li>Custom or personalized items may not be returnable</li>
              <li>Return shipping costs may apply</li>
              <li>Refunds will be processed within 7-10 business days</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              7. Prohibited Uses
            </h2>
            <p>
              You may not use our service:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>For any unlawful purpose or to solicit others to unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              8. Intellectual Property
            </h2>
            <p>
              All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of SparkoMart and is protected by copyright and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              9. Disclaimer of Warranties
            </h2>
            <p>
              Our website and services are provided &quot;as is&quot; without any representations or warranties of any kind. We disclaim all warranties, express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              10. Limitation of Liability
            </h2>
            <p>
              In no event shall SparkoMart be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of your use of our services.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              11. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of New York State, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              12. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-4 pt-2">
            <h2 className="text-base font-bold text-gray-900">
              13. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
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
