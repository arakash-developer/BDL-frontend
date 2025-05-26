import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { AiOutlineProduct } from "react-icons/ai";
import { Link } from "react-router-dom";
import slogan from "/assets/slogan.png";

const Navbar = () => {
  const [greetings, setGreetings] = useState([]);

  // Fetch greeting data from the API
  useEffect(() => {
    fetch("https://code.bdluminaries.com/api/v1/greeting")
      .then((response) => response.json())
      .then((data) => setGreetings(data))
      .catch((error) => console.error("Error fetching greetings:", error));
  }, []);

  return (
    <div className="flex items-center justify-between h-[3%] bg-[#000000] md:rounded-b-2xl relative z-30">
      <Link
        className="flex h-full items-center justify-center w-[15%] text-xs"
        to="/"
      >
        <img
          className="h-full drop-shadow-custom"
          src="/assets/bdl.png"
          alt=""
        />
      </Link>
      <Marquee
        speed={20}
        direction="left"
        pauseOnHover={true}
        reverse={true}
        gradient={false}
        gradientColor={["#6FA710"]}
        className="h-full"
      >
        <div className="flex items-center">
          {greetings.length > 0 ? (
            greetings
              .filter((greeting) => greeting.status === "active")
              .map((greeting) => (
                <img
                  key={greeting._id}
                  className="h-7"
                  src={`https://code.bdluminaries.com/${greeting.image}`}
                  alt={greeting.title}
                />
              ))
          ) : (
            // Fallback in case data is not yet loaded
            <>
              <img className="h-7" src={slogan} alt="slogan" />
              <img className="h-7" src={slogan} alt="slogan" />
              <img className="h-7" src={slogan} alt="slogan" />
            </>
          )}
        </div>
      </Marquee>
      <Link
        className="w-[15%] flex justify-center items-center text-[#F15B26]"
        to="/menu"
      >
        <AiOutlineProduct />
      </Link>
    </div>
  );
};

export default Navbar;
