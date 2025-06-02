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
    <div
      className={`${className} flex items-center justify-between h-[4%] md:rounded-b-2xl relative z-30`}
    >
      <Link
        className="flex items-center justify-center  bg-[#000000] w-[180px] h-[40px] text-xs relative"
        to="/"
      >
        <img
          className="h-[25px] w-[30px] drop-shadow-custom"
          src="/assets/bdl.png"
          alt=""
        />
      </Link>
      <div className=" bg-[#000000] h-full">
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
                    src={`${serverUrl}/${greeting.image}`}
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
      </div>
      <div className=" bg-[#000000] w-[180px] h-[40px] relative flex justify-center items-center">
        {menu ? (
          <div
            className="w-full h-full flex justify-center items-center  text-[#F15B26]  cursor-pointer"
            onClick={click}
          >
            <HiDotsHorizontal className="text-xl" />
          </div>
        ) : (
          <Link
            className="w-full h-full flex justify-center items-center text-[#F15B26]"
            to="/menu"
          >
            <AiOutlineProduct className="text-xl" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
