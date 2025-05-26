import React, { useEffect, useState } from "react";
import Marquee from "react-marquee-slider";
import axios from "../axios";

const LogoMarquee = () => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/profiles");
        
        if (res.data && res.data.length > 0) {
          const logoData = res.data[0].portfolio.map((image) => ({
            src: `https://code.bdluminaries.com/${image}`,
            alt: "Portfolio Logo",
          }));
          setLogos(logoData);
        } else {
          console.error("No portfolio data found");
        }
      } catch (error) {
        console.error("Error fetching the group data:", error);
      }
    };
  
    getData();
  }, [logos]);  // Adding logos as a dependency
  


  return (
    <div className="marquee-container">
      <Marquee key={logos.length} velocity={20}>
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo.src}
            alt={logo.alt}
            className="m-0 mx-3 h-8"
          />
        ))}
      </Marquee>

    </div>
  );
};

export default LogoMarquee;
