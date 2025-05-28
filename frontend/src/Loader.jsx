import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-24 h-24">
        {/* Outer circle - slow spin */}
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-purple-500 animate-spin"></div>

        {/* Middle circle - reverse spin using inline style */}
        <div
          className="absolute inset-2 rounded-full border-4 border-b-transparent border-blue-400"
          style={{
            animation: "spinReverse 3s linear infinite",
          }}
        ></div>

        {/* Inner circle - fast spin */}
        <div className="absolute inset-4 rounded-full border-4 border-l-transparent border-green-400 animate-spin"></div>

        {/* Custom CSS for reverse spin */}
        <style>
          {`
            @keyframes spinReverse {
              0% {
                transform: rotate(360deg);
              }
              100% {
                transform: rotate(0deg);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Loader;
