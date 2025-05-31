import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "../axios";

// for button
import clickGif from "/click.gif";
const RecentWorks = () => {
  let settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    cssEase: "linear",
    autoplay: true,
    autoplaySpeed: 4000,
  };
  let serverUrl = import.meta.env.VITE_SERVER_URL;
  let navigate = useNavigate();
  const [works, setWorks] = useState([]);
  const [selectedRecentImage, setSelectedRecentImage] = useState("");

  // Fetch recent works from API
  useEffect(() => {
    const fetchRecentWorks = async () => {
      try {
        let res = await axios.get("/recent-works");
        setWorks(res.data.reverse()); // Reverse the order to show the latest works first
        if (res.data.length > 0) {
          setSelectedRecentImage(res.data[0].images[0]); // Set the first image as selected
        }
      } catch (error) {
        console.error("Error fetching recent works:", error);
      }
    };
    fetchRecentWorks();
  }, []);

  // Function to handle clicking on an image
  const handleImageClick = (image, id) => {
    console.log(id, image);
    navigate(`/work/${id}`);
  };

  // for button
  const [activeIndex, setActiveIndex] = useState(0);
  const [showButton, setShowButton] = useState(true);
  useEffect(() => {
    let autoIncrementTimer;
    let buttonVisibilityTimer;

    if (activeIndex > 0 && activeIndex <= 16) {
      autoIncrementTimer = setTimeout(() => {
        setActiveIndex((prev) => prev + 1);
      }, 100);
    } else if (activeIndex === 17) {
      autoIncrementTimer = setTimeout(() => {
        setActiveIndex(0);
        setShowButton(true);
      }, 10000);
    }

    if (!showButton) {
      buttonVisibilityTimer = setTimeout(() => {
        setShowButton(true);
      }, 10000);
    }

    return () => {
      clearTimeout(autoIncrementTimer);
      clearTimeout(buttonVisibilityTimer);
    };
  }, [activeIndex, showButton]);
  const handleButtonClick = () => {
    setShowButton(false);
    setActiveIndex((prev) => (prev < 16 ? prev + 1 : 17));
  };

  return (
    <div
      style={{ background: `url(${selectedRecentImage})` }}
      className={`h-[48.5%] !bg-cover grid grid-cols-5 grid-rows-5 gap-1 relative z-[1]`}
    >
      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        <Slider className="h-full w-full" {...settings}>
          {works
            .sort((a, b) => a.prioroty - b.prioroty)
            .map((work) =>
              work.images
                .filter((image, index) => index < 4)
                .map((image, index) => (
                  <div key={`${work._id}-${index}`} className="h-full">
                    <img
                      className="image h-full w-full object-cover"
                      src={`${serverUrl}/${image}`}
                      alt="Recent Work"
                    />
                  </div>
                ))
            )}
        </Slider>
      </div>
      <div
        onClick={() => handleImageClick(works[0]?.images[0], works[0]?._id)}
        className={`one bg-red-400 relative cursor-pointer ${
          activeIndex >= 1 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500 `}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[0]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2  rounded-t ">
          {works[0]?.title}
        </p>
      </div>
      <div
        // onClick={() => handleImageClick(works[15]?.images[0], works[15]?._id)}
        className={`sixteen bg-rose-400 relative ${
          activeIndex >= 16 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        {/* <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[15]?.images[0]}`}
          alt=""
        /> */}
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2  rounded-t ">
          {/* {works[15]?.title} */}
          15 To All
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[14]?.images[0], works[14]?._id)}
        className={`fifteen bg-fuchsia-400 relative ${
          activeIndex >= 15 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[14]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2  rounded-t ">
          {works[14]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[13]?.images[0], works[13]?._id)}
        className={`fourteen bg-emerald-400 relative cursor-pointer ${
          activeIndex >= 14 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[13]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[13]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[12]?.images[0], works[12]?._id)}
        className={`thirteen bg-amber-400 relative cursor-pointer ${
          activeIndex >= 13 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[12]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[12]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[1]?.images[0], works[1]?._id)}
        className={`two bg-blue-400 relative cursor-pointer ${
          activeIndex >= 2 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[1]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[1]?.title}
        </p>
      </div>
      <div
        className={`seventeen bg-violet-400 col-span-3 row-span-3 ${
          activeIndex === 17 ? "opacity-0" : "opacity-0"
        } transition-opacity duration-500`}
      ></div>
      <div
        onClick={() => handleImageClick(works[11]?.images[0], works[11]?._id)}
        className={`twelve bg-lime-400 relative cursor-pointer ${
          activeIndex >= 12 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[11]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[11]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[2]?.images[0], works[2]?._id)}
        className={`three bg-green-400 relative cursor-pointer ${
          activeIndex >= 3 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[2]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[2]?.title}
        </p>
      </div>

      <div
        onClick={() => handleImageClick(works[10]?.images[0], works[10]?._id)}
        className={`eleven bg-cyan-400 relative cursor-pointer ${
          activeIndex >= 11 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[10]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[10]?.title}-
        </p>
      </div>

      <div
        onClick={() => handleImageClick(works[3]?.images[0], works[3]?._id)}
        className={`four bg-yellow-400 relative cursor-pointer ${
          activeIndex >= 4 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[3]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[3]?.title}
        </p>
      </div>

      <div
        onClick={() => handleImageClick(works[9]?.images[0], works[9]?._id)}
        className={`ten bg-gray-400 relative cursor-pointer ${
          activeIndex >= 10 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[9]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[9]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[4]?.images[0], works[4]?._id)}
        className={`five bg-purple-400 relative cursor-pointer ${
          activeIndex >= 5 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[4]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[4]?.title}
        </p>
      </div>

      <div
        onClick={() => handleImageClick(works[5]?.images[0], works[5]?._id)}
        className={`six bg-pink-400 relative cursor-pointer ${
          activeIndex >= 6 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[5]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[5]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[6]?.images[0], works[6]?._id)}
        className={`seven bg-indigo-400 relative cursor-pointer ${
          activeIndex >= 7 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[6]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[6]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[7]?.images[0], works[7]?._id)}
        className={`eight bg-violet-400 relative cursor-pointer ${
          activeIndex >= 8 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[7]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[7]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[8]?.images[0], works[8]?._id)}
        className={`nine bg-orange-400 relative cursor-pointer ${
          activeIndex >= 9 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}
      >
        <img
          className="h-full w-full object-cover"
          src={`${serverUrl}/${works[8]?.images[0]}`}
          alt=""
        />
        <p className="absolute textShadow-custom bg-white/30 left-1/2 -translate-x-1/2 bottom-0 textShadow text-xs text-white font-bold px-2 rounded-t">
          {works[8]?.title}
        </p>
      </div>
      {showButton && (
        <button
          onClick={handleButtonClick}
          className="absolute top-2 left-2  text-white p-1 border w-[10%]"
        >
          <img className="w-full" src={clickGif} alt="" />
        </button>
      )}
    </div>
  );
};

export default RecentWorks;
