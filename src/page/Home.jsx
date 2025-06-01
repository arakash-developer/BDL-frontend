import React from "react";
import MockupZones from "../components/MockupZones";
import RecentWorks from "../components/RecentWorks";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="h-screen overflow-hidden relative flex flex-col justify-between">
      <MockupZones />
      <Navbar />
      <RecentWorks />
    </div>
  );
};

export default Home;
