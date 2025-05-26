import React, { useState } from 'react'
import {
  FaFacebookF,
  FaHeart,
  FaInstagram,
  FaLinkedinIn,
  FaRegHeart,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";


const BlogPost = ({ src, title, description }) => {
    let [show,setShow] = useState(false)
  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mb-6">
        <img src={src} alt="Image 1" className="rounded-lg mb-4" />
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex items-baseline justify-between">
          {show ? (
            <Link
              onClick={() => setShow(!show)}
              className="text-[12px] text-red-500"
            >
              <FaHeart />
            </Link>
          ) : (
            <Link
              onClick={() => setShow(!show)}
              className="text-[12px] text-gray-600"
            >
              <FaRegHeart />
            </Link>
          )}
          <div className="icon flex gap-x-2 justify-end">
            <p className="text-xs text-gray-500 cursor-pointer">Share</p>
            {/* <Link to="/" className="text-[12px] text-[#1877F2]">
              <FaFacebookF />
            </Link>
            <Link to="/" className="text-[12px] text-[#ffc273]">
              <FaInstagram />
            </Link>
            <Link to="/" className="text-[12px] text-[#1DA1F2]">
              <FaTwitter />
            </Link>
            <Link to="/" className="text-[12px] text-[#0077B5]">
              <FaLinkedinIn />
            </Link> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost