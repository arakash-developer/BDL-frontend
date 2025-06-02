import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "../axios";

const MockupZones = () => {
  let serverUrl = import.meta.env.VITE_SERVER_URL; 
  let navigate = useNavigate();

  // Slider settings
  const settings = {
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

  const [zones, setZones] = useState();

  // Fetch mockup zones from API
  useEffect(() => {
    const fetchMockupZones = async () => {
      try {
        let res = await axios.get("/mokupzone-banner");
        if (res.status === 200) {
          setZones(res.data);
          console.log("Mockup Zones Data:",res.data);
        }
      } catch (error) {
        console.error("Error fetching mockup -:", error);
      }
    };

    fetchMockupZones();
  }, []);

  const handleImageClick = (zone) => {
    console.log(zone);
    navigate(`/mockup/${zone.mokupzone}`);
  };

  return (
    <Slider className="h-[48%] w-screen" {...settings}>
      {zones?.map((zone, index) => (
        <div
          className="flex-1"
          key={index}
          onClick={() => handleImageClick(zone)}
        >
          <div key={index} className="h-full">
            <img
              className="image h-full w-full object-cover"
              src={`${serverUrl}/${zone.image}`}
              alt={`Zone ${zone.mokupzone}`}
            />
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default MockupZones;
