import React from "react";

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`text-center max-w-2xl mx-auto mb-10 md:mb-12 ${className}`}>
      <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-gray-900 tracking-tight">
        {title}
      </h2>
      <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-xl mx-auto">
        {subtitle}
      </p>
      {/* Golden decorative line */}
      <div className="w-16 h-[3px] bg-[#F2B52B] rounded-full mx-auto mt-4" />
    </div>
  );
}
