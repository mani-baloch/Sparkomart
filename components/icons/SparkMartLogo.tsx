import React from "react";

interface SparkMartLogoProps {
  variant?: "dark" | "light";
  layout?: "badge" | "horizontal";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SparkMartLogo({
  variant = "dark",
  layout = "badge",
  className = "",
}: SparkMartLogoProps) {
  const isLight = variant === "light";

  if (layout === "badge") {
    return (
      <div
        className={`w-[62px] h-[62px] sm:w-[66px] sm:h-[66px] bg-white rounded-xl sm:rounded-2xl p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center justify-center select-none hover:shadow-md transition-shadow duration-200 ${className}`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dark Navy Blue Curved Handle */}
          <path
            d="M43 23 V14.5 C43 10 46 6.5 50 6.5 C54 6.5 57 10 57 14.5 V23"
            stroke="#16375B"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Orange Shopping Bag with Notch */}
          <path
            d="
              M 35 23
              H 65
              C 69 23, 72 26, 72 30
              V 58
              C 72 62, 69 65, 65 65
              H 55
              C 51 65, 49 62, 49 58
              V 47
              C 49 41, 44 38, 38 41
              C 32 44, 28 41, 28 36
              V 30
              C 28 26, 31 23, 35 23
              Z
            "
            fill="#F26E22"
          />

          {/* Dark Navy Blue Cursor Arrow pointing UP-RIGHT (↗) */}
          <path
            d="
              M 44.5 45.2
              C 45.8 46.5, 45.8 48, 44.5 49.2
              L 39.2 64.2
              C 38.4 66, 36.6 66.2, 35.4 64.8
              L 34.2 57.5
              L 26.8 56.5
              C 25.2 56.2, 24.6 54.2, 25.8 53
              L 41.2 44.2
              C 42.4 43.4, 43.4 44, 44.5 45.2
              Z
            "
            fill="#16375B"
          />

          {/* SparkoMart Typography */}
          <text
            x="50"
            y="83"
            textAnchor="middle"
            fontFamily="var(--font-sans), system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="15"
            letterSpacing="-0.3"
          >
            <tspan fill="#F26E22">Sparko</tspan>
            <tspan fill="#16375B">Mart</tspan>
          </text>
        </svg>
      </div>
    );
  }

  // Horizontal layout for Footer or compact headers
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="w-11 h-11 bg-white rounded-xl p-0.5 shadow-xs border border-gray-100 flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 100 80"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M43 23 V14.5 C43 10 46 6.5 50 6.5 C54 6.5 57 10 57 14.5 V23"
            stroke="#16375B"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="
              M 35 23
              H 65
              C 69 23, 72 26, 72 30
              V 58
              C 72 62, 69 65, 65 65
              H 55
              C 51 65, 49 62, 49 58
              V 47
              C 49 41, 44 38, 38 41
              C 32 44, 28 41, 28 36
              V 30
              C 28 26, 31 23, 35 23
              Z
            "
            fill="#F26E22"
          />
          <path
            d="
              M 44.5 45.2
              C 45.8 46.5, 45.8 48, 44.5 49.2
              L 39.2 64.2
              C 38.4 66, 36.6 66.2, 35.4 64.8
              L 34.2 57.5
              L 26.8 56.5
              C 25.2 56.2, 24.6 54.2, 25.8 53
              L 41.2 44.2
              C 42.4 43.4, 43.4 44, 44.5 45.2
              Z
            "
            fill="#16375B"
          />
        </svg>
      </div>

      <div className="flex items-baseline">
        <span className="text-xl sm:text-2xl font-black tracking-tight">
          <span className="text-[#F26E22]">Sparko</span>
          <span className={isLight ? "text-white" : "text-[#16375B]"}>Mart</span>
        </span>
      </div>
    </div>
  );
}
