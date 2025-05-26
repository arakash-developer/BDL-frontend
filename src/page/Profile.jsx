import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

import {
  FaBriefcase,
  FaHammer,
  FaTrophy,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import { MdOutlineConstruction } from "react-icons/md";
import axios from "../axios";
import LogoMarquee from "../components/LogoMarquee";
import Navbar from "../components/Navbar";
import Progress from "../components/Progress";

const Profile = () => {
  let navigate = useNavigate();
  const [isItemVisible, setIsItemVisible] = useState(false);
  const [profileData, setProfileData] = useState([]);

  const handleToggle = () => {
    setIsItemVisible(!isItemVisible);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const getData = async () => {
      try {
        let res = await axios.get("/profiles");
        setProfileData(res.data);
      } catch (error) {
        console.error("Error fetching the group data:", error);
      }
    };
    getData();
  }, []);

  return (
    <div className="h-screen pb-8 pt-0 bg-gray-100 ">
      <Navbar />

      <div className="h-[97%] grid grid-cols-1 grid-rows-9 gap-0">
        <div className="row-span-2 bg-slate-400">
          {profileData.map((item) => (
            <video
              key={item.id}
              className="w-full h-full object-cover"
              controls
              autoPlay
              loop
              src={`https://code.bdluminaries.com/${item.video}`}
            />
          ))}
        </div>
        <div className="row-span-3 bg-[#33420a] px-4 pt-5  text-justify text-[#eeeeee] overflow-scroll  grid grid-cols-6 gap-2 ">
          <div className="col-span-3 flex flex-col justify-around">
            <div className="">
              <h2 className="textShadow uppercase -mb-[18px] ml-[33px] text-[10px] companyText text-[#f15c26d0] font-bold opacity-100 ">
                Company
              </h2>
              <h2 className="textShadow text-5xl text-[#8ac2495d] font-bold opacity-100">
                Profile
              </h2>
            </div>
            <div>
              <p className="text-xs mb-3">
                {profileData.map((item) => item.article)}
              </p>

              <p className="text-lg font-sign">Javed A. Bhuiya</p>

              <p className="text-xs">Chairman & CEO</p>
            </div>
          </div>

          {profileData.map((item) => (
            <img
              className="h-[100%] object-cover rounded-b-2xl col-span-3"
              src={`https://code.bdluminaries.com/${item.image}`}
              alt=""
            />
          ))}
        </div>
        <div className="row-span-4 grid grid-cols-3 grid-rows-2 px-2 pt-4 pb-0 gap-1 bg-[#33420a]">
          {/* Completed Projects */}
          <Progress
            progressName="Completed Projects"
            progressValue={
              profileData.length > 0
                ? (profileData[0].completedProjects / 1000) * 100
                : 0
            }
            progressRate={
              profileData.length > 0 ? profileData[0].completedProjects : "N/A"
            }
            icon={FaBriefcase}
          />

          {/* Satisfied Clients */}
          <Progress
            progressName="Satisfied Clients"
            progressValue={95}
            progressRate={
              profileData.length > 0
                ? Math.floor(
                    ((profileData[0].completedProjects +
                      profileData[0].underConstruction +
                      profileData[0].ongoingProjects) /
                      profileData[0].completedProjects) *
                      100 -
                      (profileData[0].ongoingProjects +
                        profileData[0].underConstruction)
                  ) + "%"
                : "N/A"
            }
            icon={FaUserTie}
          />

          {/* Under Construction */}
          <Progress
            progressName="Under Construction"
            progressValue={
              profileData.length > 0 ? profileData[0].underConstruction : 0
            }
            progressRate={
              profileData.length > 0 ? profileData[0].underConstruction : "N/A"
            }
            icon={MdOutlineConstruction}
          />

          {/* Ongoing Projects */}
          <Progress
            progressName="Ongoing Projects"
            progressValue={
              profileData.length > 0 ? profileData[0].ongoingProjects : 0
            }
            progressRate={
              profileData.length > 0 ? profileData[0].ongoingProjects : "N/A"
            }
            icon={FaHammer}
          />

          {/* Team Members */}
          <Progress
            progressName="Team Members"
            progressValue={
              profileData.length > 0 ? profileData[0].teamMembers : 0
            }
            progressRate={
              profileData.length > 0 ? profileData[0].teamMembers : "N/A"
            }
            icon={FaUsers}
          />

          {/* Awards Won */}
          <Progress
            progressName="Awards Won"
            progressValue={profileData.length > 0 ? profileData[0].awards : 0}
            progressRate={
              profileData.length > 0 ? profileData[0].awards : "N/A"
            }
            icon={FaTrophy}
          />

          {/* Marquee Section */}
          <div className="col-span-3 bg-[#33420a] flex items-center py-5">
            <LogoMarquee />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
