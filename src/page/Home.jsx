import React from "react";
import MockupZones from "../components/MockupZones";
import RecentWorks from "../components/RecentWorks";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="h-[100vh] overflow-hidden relative flex flex-col justify-between">
      <MockupZones />
      <Navbar />
      <RecentWorks />
    </div>
  );
};

export default Home;
