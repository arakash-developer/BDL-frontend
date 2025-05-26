import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import { AiOutlineProduct } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import slogan from "/assets/slogan.png";

const UserReviewForm = ({ setReview }) => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage({
        url: URL.createObjectURL(file),
        type: file.type,
      });
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setReview({ text, image });
    navigate("/review-display");
  };

  return (
    <div className="h-screen pb-9 pt-8 bg-gray-100">
      <div className="flex items-center justify-between absolute top-0 left-0  h-8 bg-[#000000] ">
        <Link
          className="flex items-center justify-center w-[20%] text-xs"
          to="/"
        >
          <img
            className="w-4/5 drop-shadow-custom"
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
          className="h-8 "
        >
          <div className="flex h-full">
            <img className=" h-8" src={slogan} alt="" />
            <img className=" h-8" src={slogan} alt="" />
            <img className=" h-8" src={slogan} alt="" />
          </div>
        </Marquee>
        <Link
          className="w-[20%] flex justify-center items-center text-[#F15B26]"
          to="/product/detail/one"
        >
          <AiOutlineProduct />
        </Link>
      </div>

      <div className="p-4 bg-white shadow-md rounded-lg mx-3 mt-3">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <img
              className="w-12 h-12 rounded-full"
              src="https://via.placeholder.com/150"
              alt="User profile"
            />
            <div className="ml-3">
              <h3 className="text-lg font-semibold">User Name</h3>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload Image or Video
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full"
            />
            {image && (
              <img
                src={image.url}
                alt="Uploaded preview"
                className="mt-2 max-h-40"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Review
            </label>
            <textarea
              value={text}
              onChange={handleTextChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              placeholder="Write your review here..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default UserReviewForm;
