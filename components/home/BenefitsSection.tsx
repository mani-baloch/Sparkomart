import React from "react";
import { Truck, Shield, Headphones, CreditCard } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Quick delivery from trusted suppliers across USA",
  },
  {
    icon: Shield,
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
    <section id="benefits" className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl py-10 px-6 sm:py-12 sm:px-6 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col items-center text-center"
              >
                {/* Circular pale warm yellow icon container */}
                <div className="w-20 h-20 rounded-full bg-[#FEF6E4] flex items-center justify-center text-[#DE9D1A] mb-6 shrink-0">
                  <Icon className="w-8 h-8 stroke-[1.75]" />
                </div>

                <h3 className="text-lg sm:text-[19px] font-bold text-gray-900 mb-3 tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed max-w-[210px]">
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

