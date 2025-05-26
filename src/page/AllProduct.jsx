import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const AllProduct = () => {
  return (
    <div className="h-screen  flex flex-col justify-between">
      <Navbar />
      {/* <div className="overflow-y-scroll flex flex-wrap justify-between gap-y-3 p-2 pr-3">
        {images.map((img, index) => (
          <Link
            to="/product/detail"
            className="w-[48%] inline-block"
            key={index}
          >
            <img
              className="w-[100%] rounded-md"
              src={img}
              alt={`Product ${index + 1}`}
            />
          </Link>
        ))}
      </div> */}
      <Footer />
    </div>
  );
};

export default AllProduct;
