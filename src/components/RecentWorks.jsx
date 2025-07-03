import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
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
  const [isPopupVisible, setPopupVisible] = useState(false);
  const popupRef = useRef(null);
  let navigate = useNavigate();
  const [works, setWorks] = useState([]);
  const [selectedRecentImage, setSelectedRecentImage] = useState("");
  const [allCount, setAllCount] = useState(0);
  const [recentBanner, setRecentBanner] = useState([]);
  const [recentLimit, setRecentLimit] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  let limit = 20;

  console.log("works:", works);
  // Fetch recent works from API
  const fetchRecentWorks = async () => {
    try {
      let res = await axios.get("recent-works/prioritized");
      setWorks(res.data.reverse()); // Reverse the order to show the latest works first
      if (res.data.length > 0) {
        setSelectedRecentImage(res.data[0].images[0]); // Set the first image as selected
      }
    } catch (error) {
      console.error("Error fetching recent works:", error);
    }
  };
  const fetchHome = async () => {
    try {
      let res = await axios.get("/home");
      setAllCount(res.data);
    } catch (error) {
      console.error("Error fetching home:", error);
    }
  };
  const recentLimitfn = async (pageNumber = 1) => {
    if (loadingMore) return; // avoid multiple calls

    setLoadingMore(true);
    try {
      let res = await axios.get(`/recent-works/recentlimitwork?limit=${limit}&page=${pageNumber}`);

      const newData = res.data.data;

      if (newData.length < limit) {
        setHasMore(false); // no more data to load
      }

      if (pageNumber === 1) {
        setRecentLimit(newData); // first load replace data
      } else {
        setRecentLimit((prev) => [...prev, ...newData]); // append on subsequent loads
      }

      console.log("Recent Limit Data:", newData);
    } catch (error) {
      console.error("Error fetching recent limit works:", error);
    }
    setLoadingMore(false);
  };

  const fetchRecentBanner = async () => {
    try {
      let res = await axios.get("/recentWorkBanner");
      setRecentBanner(res.data);
      console.log("Recent Banner:", res.data);
      // console.log("Recent Banner Data:", res.data);
    } catch (error) {
      console.error("Error fetching recent banner:", error);
    }
  };
  useEffect(() => {
    fetchRecentWorks();
    fetchHome();
    fetchRecentBanner();
    recentLimitfn(page);
  }, []);
  // Function to handle clicking on an image
  const handleImageClick = (image, id) => {
    console.log(id, image);
    if (id !== null) {
      navigate(`/work/${id}`);
    }
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
  let handlerRecentGoto = (recent) => {
    if (recent !== null) {
      navigate(`/work/${recent}`);
    }
  };

  // Close popup if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    }

    if (isPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible]);

  // Update useEffect for page changes
  useEffect(() => {
    recentLimitfn(page);
  }, [page]);

  const containerRef = useRef(null);
  const [passed10Percent, setPassed10Percent] = useState(false);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;

      if (scrollPercent >= 10) {
        if (!passed10Percent) {
          console.log("User scrolled past 10%!");
          setPage((prev) => prev + 1);
          setPassed10Percent(true);
        }
      } else {
        if (passed10Percent) {
          // User scrolled back above 10%
          setPassed10Percent(false);
        }
      }
    }
  };

  return (
    <div
      style={{ background: `url(${selectedRecentImage})` }}
      className={`h-[48%] !bg-cover grid grid-cols-5 grid-rows-5 gap-1 relative z-[1]`}>
      {/* {isPopupVisible && (
        <div
          ref={popupRef}
          className="absolute top-0 left-0 w-full h-full z-[999999] bg-[#8BC24A] p-4 "
        >
          <div className="grid grid-cols-4 items-start justify-start gap-y-3 overflow-y-scroll h-full">
            {recentlimit.map((work, i) => (
              <div key={i} className="w-[85px] h-[70px] bg-[#F15B26]">
                {i}
              </div>
            ))}
            <button onClick={() => setPopupVisible(false)}>
              <IoClose className="absolute top-2 right-1 text-2xl cursor-pointer" />
            </button>
          </div>
        </div>
      )} */}
      {isPopupVisible && (
        <div ref={popupRef} className="absolute top-0 left-0 w-full h-full z-[999999] bg-[#DCFCE7] p-4">
          <div className="relative w-full h-full">
            {/* Close button */}
            <button
              onClick={() => setPopupVisible(false)}
              className="absolute -top-2 -right-2 z-10 bg-white hover:bg-gray-200 transition-colors duration-200 p-1.5 rounded-full shadow-lg">
              <IoClose className="text-2xl text-[#8BC24A]" />
            </button>

            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="grid grid-cols-4 items-start justify-start gap-4 overflow-y-scroll pt-2 !h-[95%] no-scrollbar">
              {recentLimit.map((work, i) => (
                <div
                  key={i}
                  onClick={() => handleImageClick(work.images[0], work._id)}
                  className="aspect-square relative cursor-pointer hover:opacity-80 transition-opacity">
                  <img
                    className="h-full w-full object-cover"
                    src={`${serverUrl}/${work.images[0]}`}
                    alt={work.title}
                  />
                  <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                    {work.title}
                  </p>
                </div>
              ))}
              {loadingMore && <div className="col-span-4 text-center py-4 text-black">Loading more...</div>}
              {!hasMore && (
                <div className="col-span-4 text-center py-4 text-black">No more works to show</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        <Slider className="h-full w-full" {...settings}>
          {recentBanner
            .sort((a, b) => a.priority - b.priority)
            .map((work) => (
              <div onClick={() => handlerRecentGoto(work.recentWork)} key={`${work._id}`} className="h-full">
                <img
                  className="image h-full w-full object-cover"
                  src={`${serverUrl}/${work.image}`}
                  alt="Recent Work"
                />
              </div>
            ))}
          {/* {works
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
            )} */}
        </Slider>
      </div>
      <div
        onClick={() => handleImageClick(works[0]?.images[0], works[0]?._id)}
        className={`one bg-red-400 relative cursor-pointer ${
          activeIndex >= 1 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500 `}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[0]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[0]?.title}
        </p>
      </div>
      <div
        // onClick={() => handleImageClick(works[15]?.images[0], works[15]?._id)}
        onClick={() => setPopupVisible(true)}
        className={`sixteen bg-rose-400 relative ${
          activeIndex >= 16 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img
          className="h-full w-full object-cover blur-sm"
          src={`${serverUrl}/${works[7]?.images[0]}`}
          alt=""
        />
        <p className="text-nowrap p-1 rounded-md text-xl bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-1/2 translate-y-1/2 text-white font-bold  text-center cursor-pointer ">
          1 - {allCount.recentWorkCount}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[14]?.images[0], works[14]?._id)}
        className={`fifteen bg-fuchsia-400 relative ${
          activeIndex >= 15 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[14]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[14]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[13]?.images[0], works[13]?._id)}
        className={`fourteen bg-emerald-400 relative cursor-pointer ${
          activeIndex >= 14 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[13]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[13]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[12]?.images[0], works[12]?._id)}
        className={`thirteen bg-amber-400 relative cursor-pointer ${
          activeIndex >= 13 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[12]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[12]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[1]?.images[0], works[1]?._id)}
        className={`two bg-blue-400 relative cursor-pointer ${
          activeIndex >= 2 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[1]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[1]?.title}
        </p>
      </div>
      <div
        className={`seventeen pointer-events-none bg-violet-400 col-span-3 row-span-3 ${
          activeIndex === 17 ? "opacity-0" : "opacity-0"
        } transition-opacity duration-500`}></div>
      <div
        onClick={() => handleImageClick(works[11]?.images[0], works[11]?._id)}
        className={`twelve bg-lime-400 relative cursor-pointer ${
          activeIndex >= 12 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[11]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[11]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[2]?.images[0], works[2]?._id)}
        className={`three bg-green-400 relative cursor-pointer ${
          activeIndex >= 3 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[2]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[2]?.title}
        </p>
      </div>

      <div
        onClick={() => handleImageClick(works[10]?.images[0], works[10]?._id)}
        className={`eleven bg-cyan-400 relative cursor-pointer ${
          activeIndex >= 11 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[10]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[10]?.title}
        </p>
      </div>

      <div
        onClick={() => handleImageClick(works[3]?.images[0], works[3]?._id)}
        className={`four bg-yellow-400 relative cursor-pointer ${
          activeIndex >= 4 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[3]?.images[0]}`} alt="" />
        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[3]?.title}
        </p>
      </div>

      <div
        onClick={() => handleImageClick(works[9]?.images[0], works[9]?._id)}
        className={`ten bg-gray-400 relative cursor-pointer ${
          activeIndex >= 10 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[9]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[9]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[4]?.images[0], works[4]?._id)}
        className={`five bg-purple-400 relative cursor-pointer ${
          activeIndex >= 5 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[4]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[4]?.title}
        </p>
      </div>

      <div
        onClick={() => handleImageClick(works[5]?.images[0], works[5]?._id)}
        className={`six bg-pink-400 relative cursor-pointer ${
          activeIndex >= 6 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[5]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[5]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[6]?.images[0], works[6]?._id)}
        className={`seven bg-indigo-400 relative cursor-pointer ${
          activeIndex >= 7 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[6]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[6]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[7]?.images[0], works[7]?._id)}
        className={`eight bg-violet-400 relative cursor-pointer ${
          activeIndex >= 8 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[7]?.images[0]}`} alt="" />

        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[7]?.title}
        </p>
      </div>
      <div
        onClick={() => handleImageClick(works[8]?.images[0], works[8]?._id)}
        className={`nine bg-orange-400 relative cursor-pointer ${
          activeIndex >= 9 ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-500`}>
        <img className="h-full w-full object-cover" src={`${serverUrl}/${works[8]?.images[0]}`} alt="" />
        <p className="w-full bg-black/40 absolute textShadow-custom left-1/2 -translate-x-1/2 bottom-0 text-xs text-white font-bold  text-center">
          {works[8]?.title}
        </p>
      </div>
      {showButton && (
        <button onClick={handleButtonClick} className="absolute top-2 left-2  text-white p-1 border w-[10%]">
          <img className="w-full" src={clickGif} alt="" />
        </button>
      )}
    </div>
  );
};

export default RecentWorks;
