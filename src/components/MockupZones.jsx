import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "../axios";

const MockupZones = () => {
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
        let res = await axios.get("/mockup-zones");
        if (res.status === 200) {
          setZones(res.data);
          console.log(res.data);
        }
      } catch (error) {
        console.error("Error fetching mockup zones:", error);
      }
    };

    fetchMockupZones();
  }, []);

  const handleImageClick = (zone) => {
    console.log(zone);
    navigate(`/mockup/${zone.name}`);
  };

  return (
    <Slider className="h-[48.5%] w-screen" {...settings}>
      {zones?.map((zone, index) => (
        <div
          className="flex-1"
          key={index}
          onClick={() => handleImageClick(zone)}
        >
          <div key={index} className="h-full">
            <img
              className="image h-full w-full object-cover"
              src={`https://code.bdluminaries.com/${zone.images[0]}`}
              alt={`Zone ${zone.name}`}
            />
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default MockupZones;
