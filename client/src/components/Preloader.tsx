import { useEffect, useState } from "react";

export default function PlantPreloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // 1-second visual buffer after fully loading, then fade out
      setTimeout(() => setIsVisible(false), 1000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-cream flex justify-center align-middle items-center z-[9999] transition-opacity duration-900 ease-out">
      <div className="text-center">
        {/* Plant SVG Structure */}
        <svg
          xmlns="http://w3.org"
          viewBox="0 0 100 100"
          className="w-32 h-32 mx-auto"
        >
          {/* Ground Line */}
          <path
            d="M 20 80 L 80 80"
            stroke="#a4c2a8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Sprout Stem */}
          <path
            d="M 50 80 Q 48 50 55 30"
            fill="transparent"
            stroke="#4caf50"
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-grow-stem"
            style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
          />

          {/* Left Leaf */}
          <path
            d="M 51 55 Q 30 45 48 40 Q 50 50 51 55"
            fill="#81c784"
            className="animate-bloom-left origin-[51px_55px] scale-0"
          />

          {/* Right Leaf */}
          <path
            d="M 53 42 Q 72 30 60 22 Q 54 32 53 42"
            fill="#81c784"
            className="animate-bloom-right origin-[53px_42px] scale-0"
          />
        </svg>

        {/* Soft pulsing loading string */}
        <p className="mt-4 text-soil text-base font-medium tracking-wide animate-pulse">
          Terra Fert is loading...
        </p>
      </div>
    </div>
  );
}
