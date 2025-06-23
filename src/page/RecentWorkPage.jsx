import { Image } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "../axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";

const RecentWork = () => {
  let serverUrl = import.meta.env.VITE_SERVER_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const [shuffledContent, setShuffledContent] = useState([]);
  const [mockupImages, setMockupImages] = useState([]);
  const [recentWork, setRecentWork] = useState([]);
  const [singelRecentWork, setSingelRecentWork] = useState();
  const [selectedContent, setSelectedContent] = useState({
    type: "",
    src: "",
  });
  const [newSeletedContent, setNewSeletedContent] = useState();
  const navigate = useNavigate();

  // Add pagination states
  const [recentWorkPage, setRecentWorkPage] = useState(1);
  const [recentWorkLoading, setRecentWorkLoading] = useState(false);
  const [hasMoreRecentWorks, setHasMoreRecentWorks] = useState(true);

  useEffect(() => {
    const fetchMockupData = async () => {
      try {
        const response = await axios.get("/mockup-zones");
        const data = response?.data?.sort((a, b) => a?.prioroty - b?.prioroty);
        setMockupImages(data);
      } catch (error) {
        console.error("Error fetching mockup data:", error);
      }
    };
    fetchMockupData();
  }, []);

  // Fetch recent works from API with pagination
  useEffect(() => {
    const fetchRecentWork = async () => {
      try {
        setRecentWorkLoading(true);
        const response = await axios.get(
          `${serverUrl}/api/v1/recent-works/recentlimitwork?limit=18&page=${recentWorkPage}`
        );

        // Access the data property of the response
        const data = response.data.data;

        if (!data || data.length === 0) {
          setHasMoreRecentWorks(false);
          return;
        }

        const formattedContent = data?.flatMap((work) => {
          const images = work?.images?.map((image) => ({
            id: work?._id,
            image: `${image}`,
            type: "image",
          }));

          const videos = work?.videos?.map((video) => ({
            id: video?._id,
            video: `${video?.video}`,
            thumbnail: `${video?.thumbnail}`,
            type: "video",
          }));

          return [...images, ...videos];
        });

        if (recentWorkPage === 1) {
          setRecentWork(formattedContent);
        } else {
          setRecentWork((prev) => [...prev, ...formattedContent]);
        }
      } catch (error) {
        console.error("Error fetching recent works:", error);
        setHasMoreRecentWorks(false);
      } finally {
        setRecentWorkLoading(false);
      }
    };

    fetchRecentWork();
    const seletedRecentWork = async () => {
      try {
        const res = await axios.get(`recent-works/${id}`);
        if (res.status === 200) {
          // console.log("Selected recent work:", res.data);

          setSingelRecentWork(res?.data);
          if (!searchParams.get("src")) {
            setSearchParams({ type: "image", src: res?.data?.images[0] });
          }
          const formattedSingleContent = [res.data]?.flatMap((work) => {
            const images = work?.images?.map((image) => ({
              id: work?._id,
              image: `${image}`,
              type: "image",
            }));

            const videos = work?.videos?.map((video) => ({
              id: video?._id,
              video: `${video?.video}`,
              thumbnail: `${video?.thumbnail}`,
              type: "video",
            }));
            return [...images, ...videos];
          });
          setNewSeletedContent(formattedSingleContent);
        }
      } catch (error) {
        console.error("Error fetching recent works:", error);
      }
    };
    seletedRecentWork();
  }, [recentWorkPage]); // Keep recentWorkPage as dependency

  // Set the content to display based on clicked image or video
  useEffect(() => {
    if (recentWork.length > 0) {
      const shuffled = [
        ...(newSeletedContent || []),
        // ...recentWork.sort(() => 0.5 - Math.random()),
      ];
      setShuffledContent(shuffled);
    }
    // Safely set selectedContent using searchParams
    const type = searchParams.get("type") || "image";
    const src = searchParams.get("src");

    if (src) {
      setSelectedContent({
        type,
        src,
      });
    }
  }, [recentWork, newSeletedContent]);

  const handleContentClick = (item) => {
    console.log("Item clicked:", item);
    const newSrc = item?.type === "video" ? item?.video : item?.image; // Ensure you have the right source
    if (selectedContent.src !== newSrc) {
      setSearchParams({ src: newSrc, type: item?.type });
      displayContent(item?.type, newSrc);
    }
  };

  const handleImageClick = (mockupItem) => {
    navigate(`/mockup/${mockupItem.name}`);
  };

  const displayContent = (type, source) => {
    console.log("Displaying content:", type, source); // Debugging line
    setSelectedContent({ type, src: source });
  };

  // Enhanced scroll handler with debounce for better performance
  const handleRecentWorkScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    // Check if we're near bottom (within 20% of bottom)
    const scrollThreshold = 0.8;
    const isNearBottom =
      scrollHeight - scrollTop <= clientHeight / scrollThreshold;

    if (isNearBottom && !recentWorkLoading && hasMoreRecentWorks) {
      console.log("Loading more recent works, page:", recentWorkPage + 1);
      setRecentWorkPage((prev) => prev + 1);
    }
  };

  if (!newSeletedContent) {
    return <Preloader />;
  }

  return (
    <div className="h-screen pb-9 bg-gray-100">
      <Navbar />
      <div className="h-[97%] grid grid-rows-2 grid-cols-1">
        {/* Main display section */}
        <div>
          {searchParams.get("type") === "video" && (
            <video
              className="w-full h-full object-fit"
              controls
              autoPlay
              muted
              src={`${serverUrl}/${
                searchParams.get("src") || selectedContent.src
              }`}
            />
          )}
          {searchParams.get("type") === "image" && (
            <Image
              height="100%"
              width="100%"
              className="!w-full h-full object-cover"
              src={`${serverUrl}/${
                searchParams.get("src") || selectedContent.src
              }`}
              alt="Selected"
            />
          )}
        </div>

        {/* Recent works and mockup sections */}
        <div className="grid grid-cols-4 gap-4 p-2">
          {/* Recent Work section - add onScroll handler */}
          <div
            className="col-span-3 grid grid-cols-3 gap-2 h-full overflow-y-scroll no-scrollbar relative rounded-b"
            onScroll={handleRecentWorkScroll}
          >
            <div className="col-span-3 bg-[#F15B26] sticky top-0 left-0 h-8 flex flex-col items-center w-full shadow-md rounded-b">
              <div className="w-full">
                <div className="text-[11px] text-white font-bold capitalize w-full text-center">
                  {singelRecentWork?.projectId?.length > 60 ? (
                    <marquee speed={50} gradient={false}>
                      {singelRecentWork?.projectId}
                    </marquee>
                  ) : (
                    singelRecentWork?.projectId
                  )}
                </div>
              </div>
              <p className="text-[8px] op-0 left-0 flex items-center justify-center text-center text-white font-bold">
                {singelRecentWork?.location || "N/A"}
              </p>
            </div>
            {shuffledContent
              ?.filter((_, i) => i > 0)
              .map((item, index) => (
                <div
                  key={index}
                  className="shadow-md rounded"
                  onClick={() => handleContentClick(item)} // Use the modified click handler
                >
                  {item?.type === "image" && item?.image && (
                    <img
                      src={`${serverUrl}/${item?.image}`}
                      className="w-full h-14 object-cover rounded"
                      alt="Image"
                    />
                  )}
                  {item?.type === "video" && item?.thumbnail && (
                    <img
                      src={`${serverUrl}/${item?.thumbnail}`}
                      className="w-full h-14 object-cover rounded"
                      alt="Video"
                    />
                  )}
                </div>
              ))}
            {/* Loading indicator at bottom for better UX */}
            {recentWorkLoading && (
              <div className="col-span-3 text-center py-2 text-black">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#F15B26]"></div>
                  <span className="ml-2">Loading more...</span>
                </div>
              </div>
            )}
            {/* Message when no more content */}
            {!hasMoreRecentWorks && recentWorkPage > 1 && (
              <div className="col-span-3 text-center py-2 text-gray-500 text-sm">
                No more works to load
              </div>
            )}
          </div>

          {/* Mockup section */}
          <div className="col-span-1 grid grid-cols-1 gap-2 h-full overflow-y-scroll no-scrollbar relative rounded-b">
            <h3 className="text-xs bg-[#F15B26] sticky top-0 left-0 h-7 flex items-center justify-center text-center text-white font-bold w-full shadow-md rounded-b">
              Mockup
            </h3>
            {mockupImages?.map((mockupItem) => (
              <div
                key={mockupItem.id}
                onClick={() => handleImageClick(mockupItem)}
                className="shadow-md rounded cursor-pointer"
              >
                <img
                  src={`${serverUrl}/${mockupItem.images[0]}`}
                  className="w-full h-14 object-cover rounded"
                  alt="Mockup"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecentWork;
