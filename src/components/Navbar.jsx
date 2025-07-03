import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { AiOutlineProduct } from "react-icons/ai";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";
import slogan from "/assets/slogan.png";
const Navbar = ({ className, click, menu }) => {
  let serverUrl = import.meta.env.VITE_SERVER_URL;
  const [greetings, setGreetings] = useState([]);

  // Fetch greeting data from the API
  useEffect(() => {
    fetch(`${serverUrl}/api/v1/greeting`)
      .then((response) => response.json())
      .then((data) => setGreetings(data))
      .catch((error) => console.error("Error fetching greetings:", error));
  }, []);

  return (
    <nav className={`${className} relative z-30 w-full h-[50px]`}>
      {/* Content Container */}
      <div className="relative w-full h-full max-w-6xl mx-auto">
        <div className="relative z-10 flex items-center justify-between h-full bg-slate-800/90 backdrop-blur-sm">
          {/* Logo Section - Left */}
          <Link
            to="/"
            className="group flex items-center space-x-3 px-4 py-[2px] bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 "
            aria-label="BDL Home">
            <img className="h-10 w-10 object-contain" src="/assets/bdl.png" alt="BDL Logo" />
            <span className="text-white font-semibold text-sm hidden sm:block group-hover:text-blue-200 transition-colors">
              BDL
            </span>
          </Link>

          {/* Center Marquee Section */}
          <div className="flex-1 mx-1 h-10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <Marquee
              speed={30}
              direction="left"
              pauseOnHover={true}
              reverse={true}
              gradient={true}
              gradientColor={["rgba(0,0,0,0.1)", "transparent"]}
              className="h-full">
              <div className="flex items-center px-4">
                {greetings.length > 0
                  ? greetings
                      .filter((greeting) => greeting.status === "active")
                      .map((greeting) => (
                        <img
                          key={greeting._id}
                          className="h-[42px] w-auto object-contain filter brightness-110 hover:brightness-125 transition-all duration-300"
                          src={`${serverUrl}/${greeting.image}`}
                          alt={greeting.title}
                        />
                      ))
                  : // Fallback with better spacing
                    Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <img
                          key={index}
                          className="h-[40px] w-auto object-contain filter brightness-110"
                          src={slogan}
                          alt="BDL Slogan"
                        />
                      ))}
              </div>
            </Marquee>
          </div>

          {/* Menu Section - Right */}
          <div className="flex items-center">
            {menu ? (
              <button
                onClick={click}
                className="group flex items-center space-x-2 px-5 py-3  bg-orange-500/90 hover:bg-orange-500 border border-orange-400/50 text-white transition-all duration-300 focus:outline-none"
                aria-label="Close Menu">
                <HiDotsHorizontal className="text-lg group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-sm font-medium hidden sm:block">Close</span>
              </button>
            ) : (
              <Link
                to="/menu"
                className="group flex items-center space-x-2 px-[23px] py-3  bg-orange-500/90 hover:bg-orange-500 border border-orange-400/50 text-white transition-all duration-300 focus:outline-none"
                aria-label="Open Menu">
                <AiOutlineProduct className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-medium hidden sm:block">Menu</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
