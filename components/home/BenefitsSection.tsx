import React from "react";
import { Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Quick delivery from trusted suppliers across USA",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assured",
    description: "All products sourced from reputable sellers",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Help with orders and product questions",
  },
  {
    icon: CreditCard,
    title: "Secure Checkout",
    description: "Safe and secure payment processing",
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="w-full bg-white py-12 md:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
              >
                {/* Circular pale yellow icon container */}
                <div className="w-14 h-14 rounded-full bg-[#FEF8E8] flex items-center justify-center text-[#F2B52B] mb-4 shrink-0">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
