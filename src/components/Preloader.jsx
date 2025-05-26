import React from "react";
import "./Preloader.css"; // Importing the CSS for custom animations

const Preloader = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="flex bg-gray-900 w-full items-center justify-center h-screen text-white">
        <div className="pl relative flex justify-center items-center w-60 h-60 rotate-x-30 rotate-z-45">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`pl__dot dot-${i + 1} animate-shadow`}
            ></div>
          ))}
          <div className="pl__text absolute">
            <img src="/assets/bdl.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
