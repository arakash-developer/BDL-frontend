import React from 'react'
import {  FaFacebookSquare, FaInstagram, FaLinkedinIn, FaTiktok, FaTwitter, FaYoutube, } from 'react-icons/fa'
import {  FaMapLocationDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { FaDev } from "react-icons/fa";


const Footer = ({ className }) => {
  const d = new Date();
  let year = d.getFullYear();
  return (
    <div
      className={`bg-black fixed w-full bottom-0 py-2 px-3 flex justify-between items-center ${className}`}
    >
      <p className="text-white/70 text-[12px]">
        © {year} •{" "}
        <Link to="/" className="text-green-700 font-bold font-bdlHeading">
          BD Luminaries
        </Link>
      </p>
      <div className="">
        {/* <Link to="/contact" className="text-[12px] text-[#EA4335]">
          <FaMapLocationDot />
        </Link>
        <Link to="/" className="text-[12px] text-[#f90000]">
          <FaYoutube />
        </Link>
        <Link to="/blog" className="text-[12px] text-[#1DA1F2]">
        <FaTiktok />
        </Link>
        <Link to="/" className="text-[12px] text-[#1877F2]">
          <FaFacebookSquare />
        </Link>
        <Link to="/" className="text-[12px] text-[#ffc273]">
          <FaInstagram />
        </Link>
        <Link to="/blog" className="text-[12px] text-[#0077B5]">
          <FaLinkedinIn />
        </Link> */}
        <Link
          to="https://havetic.com/"
          className="text-[12px] flex gap-x-1 text-white/70 items-center justify-end"
        >
          Havetic
          <FaDev />
        </Link>
      </div>
    </div>
  );
};

export default Footer
