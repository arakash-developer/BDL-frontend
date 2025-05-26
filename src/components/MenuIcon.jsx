import React, { useEffect } from "react";
import { IoClose, IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import "../components/IconMenu.css";

import { FaInstagram, FaLinkedinIn, FaPhoneAlt, FaRegLightbulb } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { LuYoutube } from "react-icons/lu";
import { MdOutlineContactPhone } from "react-icons/md";
import { RiFacebookBoxLine } from "react-icons/ri";
import { SiTiktok } from "react-icons/si";

const MenuIcon = ({ className }) => {
  useEffect(() => {
    const toggleSound = document.getElementById("toggleSound");
    const openSound = document.getElementById("openSound");

    const menuToggle = document.querySelector(".menuToggle");
    const menu = document.querySelector(".menu");

    menuToggle.onclick = function () {
      menu.classList.toggle("active");
      toggleSound.currentTime = 0;
      toggleSound.play();
      if (menu.classList.contains("active")) {
        openSound.currentTime = 0;
        openSound.play();
      }
    };
  }, []);

  // Play hover sound
  const handleHover = () => {
    const hoverSound = document.getElementById("hoverSound");
    hoverSound.currentTime = 0; // Reset audio to start from the beginning
    hoverSound.play();
  };

  return (
    <div className={`body ${className}`}>
      <ul className="menu">
        <div className="menuToggle">
          <IoClose />
        </div>
        <li style={{ "--i": 0, "--clr": "#F15B26" }}>
          <Link to="https://www.instagram.com/accounts/login/?next=https%3A%2F%2Ffamilycenter.instagram.com%2Finvite%2Fp%2FUQ4KtJFka321kKbKQA0orEvY_rmQFvj4df8o4%2F%3F__coig_login%3D1" onMouseEnter={handleHover} className="group innerA">
            <FaInstagram  className="z-10 group-hover:text-[#161616] " />
          </Link>
        </li>
        <li style={{ "--i": 1, "--clr": "#fee800" }}>
          <Link
            to="/profile"
            onMouseEnter={handleHover}
            className="group innerA"
          >
            <FaRegLightbulb className="z-10 text-2xl group-hover:text-[#161616] " />
          </Link>
        </li>
        <li style={{ "--i": 2, "--clr": "#04fc43" }}>
          <Link to="/blog" onMouseEnter={handleHover} className="group innerA">
            <IoBookOutline className="z-10 group-hover:text-[#161616] " />
          </Link>
        </li>
        <li style={{ "--i": 3, "--clr": "#fe00f1" }}>
          <Link
            to="/contact"
            onMouseEnter={handleHover}
            className="group innerA"
          >
            <FaPhoneAlt className="z-10 group-hover:text-[#161616] " />
          </Link>
        </li>
        <li style={{ "--i": 4, "--clr": "#FF0000" }}>
          <Link to="#" onMouseEnter={handleHover} className="group innerA">
            <LuYoutube className="z-10 group-hover:text-[#161616] " />
          </Link>
        </li>
        <li style={{ "--i": 5, "--clr": "#1877F2" }}>
          <Link to="https://www.facebook.com/people/BD-Luminaries/61567166872903/?mibextid=kFxxJD" onMouseEnter={handleHover} className="group innerA">
            <RiFacebookBoxLine className="z-10 group-hover:text-[#161616] " />
          </Link>
        </li>
        <li style={{ "--i": 6, "--clr": "#00f2ea" }}>
          <Link to="https://www.tiktok.com/@bdluminaries?lang=en" onMouseEnter={handleHover} className="group innerA">
            <SiTiktok className="z-10 group-hover:text-[#161616] " />
          </Link>
        </li>
        <li style={{ "--i": 7, "--clr": "#0077B5" }}>
          <Link to="#" onMouseEnter={handleHover} className="group innerA">
            <FaLinkedinIn className="z-10 group-hover:text-[#161616] " />
          </Link>
        </li>
      </ul>

      {/* Audio elements */}
      <audio id="toggleSound">
        <source src="/audio/close.mp3" type="audio/mpeg" />
        <source src="/audio/close.ogg" type="audio/ogg" />
      </audio>

      <audio id="openSound">
        <source src="/audio/open.mp3" type="audio/mpeg" />
        <source src="/audio/open.ogg" type="audio/ogg" />
      </audio>

      <audio id="hoverSound">
        <source src="/audio/beep.mp3" type="audio/mpeg" />
        <source src="/audio/beep.mp3" type="audio/ogg" />
      </audio>
    </div>
  );
};

export default MenuIcon;
