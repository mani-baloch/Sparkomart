"use client";

import React, { useState } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Clock,
  Headphones,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { submitContactMessage } from "@/lib/services/contact";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitContactMessage({
        fullName: formData.fullName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (res.success) {
        setSubmitted(true);
        setFormData({ fullName: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 8000);
      } else {
        setErrorMessage(res.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      setErrorMessage("Something went wrong while sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById("contact-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our products, add items to your cart, and proceed to checkout. You can create an account or checkout as a guest.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unused items in original packaging. Contact us within 30 days of delivery to initiate a return.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for your convenience.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. International shipping may take 7-14 days.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach us via email, phone, or the contact form above. We typically respond within 24 hours during business days.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes! Once your order ships, you'll receive a tracking number via email to monitor your package's progress.",
    },
    {
      question: "Do you offer bulk discounts?",
      answer:
        "Yes! We offer special pricing for bulk orders. Contact our sales team for custom quotes on large quantity orders.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Sticky Top Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main className="flex-1 w-full">
        {/* 1. Hero Header Section */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pt-18 sm:pb-14 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-950 tracking-tight">
            Get in <span className="text-[#F2B52B]">Touch</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Have questions about our products or need assistance? We&apos;re here
            to help! Reach out to us through any of the channels below.
          </p>
        </section>

        {/* 2. Top 3 Contact Cards */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Visit Our Store */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-5">
                <MapPin className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-2.5">
                Visit Our Store
              </h3>
              <div className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal space-y-0.5">
                <p>5800 BALCONES DR 2986</p>
                <p>AUSTIN TX 78731</p>
                <p>United States</p>
              </div>
            </div>

            {/* Card 2: Call Us */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-5">
                <Phone className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-2.5">Call Us</h3>
              <div className="text-xs sm:text-sm leading-relaxed font-normal space-y-0.5">
                <a
                  href="tel:+15123565110"
                  className="text-gray-900 font-semibold hover:text-[#F2B52B] transition-colors block"
                >
                  +1 512-356-5110
                </a>
                <p className="text-gray-500">Available 9 AM – 9 PM CST</p>
              </div>
            </div>

            {/* Card 3: Email Us */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-5">
                <Mail className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-2.5">
                Email Us
              </h3>
              <div className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal space-y-0.5">
                <a
                  href="mailto:info@sparkomart.com"
                  className="hover:text-gray-900 transition-colors block"
                >
                  info@sparkomart.com
                </a>
                <a
                  href="mailto:support@sparkomart.com"
                  className="hover:text-gray-900 transition-colors block"
                >
                  support@sparkomart.com
                </a>
                <p className="text-gray-400 text-xs mt-1">
                  Response within 24 hours
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Send Us a Message & Business Hours / Support Section */}
        <section
          id="contact-form"
          className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Card (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] p-6 sm:p-8 md:p-10">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-amber-500 stroke-[2]" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-950">
                  Send us a Message
                </h2>
              </div>

              {submitted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Message sent successfully!</p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Thank you for contacting us. We will get back to you within
                      24 hours.
                    </p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-bold">Message could not be sent</p>
                    <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B] focus:ring-1 focus:ring-[#F2B52B] transition-all"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B] focus:ring-1 focus:ring-[#F2B52B] transition-all"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B] focus:ring-1 focus:ring-[#F2B52B] transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B] focus:ring-1 focus:ring-[#F2B52B] transition-all resize-y"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-black text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm shadow-xs cursor-pointer disabled:opacity-70"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </span>
                </button>
              </form>
            </div>

            {/* Right Column: Info Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Business Hours Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] p-6 sm:p-7">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-amber-500 stroke-[2]" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-950">
                    Business Hours
                  </h3>
                </div>

                <div className="divide-y divide-gray-100 text-xs sm:text-sm">
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-gray-600 font-medium">
                      Monday – Friday
                    </span>
                    <span className="font-semibold text-gray-900">
                      9:00 AM – 9:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-gray-600 font-medium">Saturday</span>
                    <span className="font-semibold text-gray-900">
                      10:00 AM – 8:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-gray-600 font-medium">Sunday</span>
                    <span className="font-semibold text-gray-900">
                      12:00 PM – 6:00 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Support Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] p-6 sm:p-7">
                <div className="flex items-center gap-2 mb-4">
                  <Headphones className="w-5 h-5 text-amber-500 stroke-[2]" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-950">
                    Customer Support
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Quick Response
                    </h4>
                    <p className="text-gray-500 leading-relaxed font-normal">
                      We typically respond to emails within 24 hours during
                      business days.
                    </p>
                  </div>

                  <hr className="border-gray-100" />

                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Phone Support
                    </h4>
                    <p className="text-gray-500 leading-relaxed font-normal">
                      Live customer support available during business hours for
                      immediate assistance.
                    </p>
                  </div>

                  <hr className="border-gray-100" />

                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Order Tracking
                    </h4>
                    <p className="text-gray-500 leading-relaxed font-normal">
                      Need help with your order? We can track your shipment and
                      provide real-time updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Frequently Asked Questions Section */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500 font-normal">
              Find answers to common questions about our products, shipping,
              returns, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] p-6 sm:p-7 hover:shadow-md transition-shadow"
              >
                <h3 className="text-sm sm:text-base font-bold text-gray-950 mb-2">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Still Have Questions Card */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
          <div className="bg-[#F8F9FA] rounded-3xl border border-gray-200/60 p-8 sm:p-12 text-center max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 mb-2 tracking-tight">
              Still have questions?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 font-normal">
              Can&apos;t find what you&apos;re looking for? Our support team is
              here to help!
            </p>
            <button
              onClick={scrollToForm}
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              Contact Us
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
