import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import {
  FaPaperPlane,
  FaFacebookF,
  FaHeart,
  FaRegHeart,
  FaTwitter,
} from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import Marquee from "react-fast-marquee";
import { Link, useNavigate } from "react-router-dom";
import slogan from "/assets/slogan.png";
import Navbar from "../components/Navbar";

const Blog = () => {
  let navigate = useNavigate();
  const [isItemVisible, setIsItemVisible] = useState(false);
  const [blogs, setBlogs] = useState([]); // State for storing blog data
  const [favorites, setFavorites] = useState({}); // State for tracking heart counts
  const [readMoreStates, setReadMoreStates] = useState({}); // State for read more toggle

  const handleToggle = () => {
    setIsItemVisible(!isItemVisible);
  };

  // Fetch blog data from API
  useEffect(() => {
    fetch("https://code.bdluminaries.com/api/v1/academys")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data
          .filter((blog) => blog.status === "active")
          .sort((a, b) => a.prioroty - b.prioroty);
        setBlogs(filteredData);
      })
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  // Handle social media share
  const handleShare = (platform, blog) => {
    const shareUrl = `https://bdluminariesweb.vercel.app/blog/`;
    const title = encodeURIComponent(blog.title);

    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`,
        "_blank"
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${title}`,
        "_blank"
      );
    }
  };

  // Handle heart count increment
  const handleHeartClick = (blogId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [blogId]: prevFavorites[blogId] ? prevFavorites[blogId] + 1 : 1,
    }));
  };

  // Handle read more toggle for individual blog
  const toggleReadMore = (blogId) => {
    setReadMoreStates((prevStates) => ({
      ...prevStates,
      [blogId]: !prevStates[blogId], // Toggle the read more state for the specific blog
    }));
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar/>

        <div className="bg-gray-100 flex flex-col items-center p-4 pb-12 overflow-y-scroll pt-4">
          {blogs.length > 0 ? (
            blogs.map((blog) => {
              const truncatedDescription = blog.description
                .split(" ")
                .slice(0, 30)
                .join(" ");
              const isReadMore = readMoreStates[blog._id]; // Get the read more state for this blog

              return (
                <div
                  key={blog._id}
                  className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mb-6"
                >
                  <img
                    src={`https://code.bdluminaries.com/${blog.image}`}
                    alt={blog.title}
                    className="rounded-lg mb-4 h-60 w-full object-cover"
                  />
                  <h2 className="text-xl font-bold mb-2 text-black">
                    {blog.title}
                  </h2>

                  <div className="text-gray-700 mb-4">
                    {/* Use dangerouslySetInnerHTML to render the description */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: isReadMore
                          ? blog.description
                          : blog.description.split(" ").slice(0, 30).join(" ") +
                            " ...",
                      }}
                    />
                    <span
                      onClick={() => toggleReadMore(blog._id)}
                      className="text-blue-500 cursor-pointer"
                    >
                      {isReadMore ? " read less" : " ... read more"}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    {/* Heart counter */}
                    <div className="flex items-center">
                      {favorites[blog._id] ? (
                        <FaHeart
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleHeartClick(blog._id)}
                        />
                      ) : (
                        <FaRegHeart
                          className="text-gray-600 cursor-pointer"
                          onClick={() => handleHeartClick(blog._id)}
                        />
                      )}
                      <span className="ml-2 text-sm text-gray-600">
                        {favorites[blog._id] || 0}
                      </span>
                    </div>

                    {/* Share buttons */}
                    <div className="icon flex gap-x-2 justify-end">
                      <p
                        className="text-sm pr-6 py-1 pl-1 bg-orange-600 rounded text-white cursor-pointer"
                        onClick={() => handleShare("facebook", blog)}
                      >
                        <FaFacebookF />
                      </p>
                      <p
                        className="text-sm pr-6 py-1 pl-1 bg-orange-600 rounded text-white cursor-pointer"
                        onClick={() => handleShare("twitter", blog)}
                      >
                        <FaTwitter />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Loading blogs...</p>
          )}

          <div
            onClick={() => navigate("/contact")}
            className="bg-gray-200 p-4 rounded-lg shadow-lg w-full max-w-md flex items-center justify-between pr-10 cursor-pointer"
          >
            <p className="text-2xl text-center text-slate-800 relative">
              Make an appointment{" "}
              <span className="Contactwith absolute -left-2.5 top-7 -rotate-45 text-[#F15B26]">
                with
              </span>{" "}
              <br />
              <span className="font-bold text-[#8AC249]">BD Luminaries</span>
            </p>
            <button>
              <FaPaperPlane />
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
