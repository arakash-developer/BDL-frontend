import { Image } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";

const Mockup = () => {
  let serverUrl = import.meta.env.VITE_SERVER_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedContent, setSelectedContent] = useState({
    type: "",
    src: "",
  });
  const [shuffledContent, setShuffledContent] = useState([]);
  const [recentWorks, setRecentWorks] = useState([]); // State for recent works
  // const [mockupImages, setMockupImages] = useState([]);
  const [singleMockupZoneImages, setSingleMockupZoneImages] = useState([]);
  const [imagePage, setImagePage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [noMoreImages, setNoMoreImages] = useState(false);
  const [noMoreVideos, setNoMoreVideos] = useState(false);
  const [recentWorkPage, setRecentWorkPage] = useState(1);
  const [recentWorkLoading, setRecentWorkLoading] = useState(false);
  const [hasMoreRecentWorks, setHasMoreRecentWorks] = useState(true);

  // Fetch data for recent works from the API
  useEffect(() => {
    const fetchRecentWorks = async () => {
      try {
        setRecentWorkLoading(true);
        const response = await axios.get(
          `${serverUrl}/api/v1/recent-works/recentlimitwork?limit=10&page=${recentWorkPage}`
        );
        // Access the data property of the response
        const data = response.data.data;

        if (!data || data.length === 0) {
          setHasMoreRecentWorks(false);
          return;
        }

        // Sort and set the recent works
        const imageWorks = data.sort((a, b) => a.priority - b.priority);
        if (recentWorkPage === 1) {
          setRecentWorks(imageWorks);
        } else {
          setRecentWorks((prev) => [...prev, ...imageWorks]);
        }
      } catch (error) {
        console.error("Error fetching recent works:", error);
      } finally {
        setRecentWorkLoading(false);
      }
    };

    fetchRecentWorks();
  }, [recentWorkPage]);

  // Fetch data for mockup images from the API
  useEffect(() => {
    // Function to fetch mockup data from the API
    // const fetchMockupData = async () => {
    //   try {
    //     const response = await fetch(
    //       `${serverUrl}/api/v1/mockup-zones`
    //     );
    //     const data = await response.json();

    //     // Process the data to extract images and videos
    //     const combinedContent = data
    //       .sort((a, b) => a.prioroty - b.prioroty)
    //       .flatMap((zone) => {
    //         const imagesWithType = zone.images.map((img) => ({
    //           type: "image",
    //           src: `${img}`,
    //         }));
    //         const videosWithType = zone.videos.map((vid) => ({
    //           type: "video",
    //           video: `${vid.video}`,
    //           thumbnail: `${vid.thumbnail}`,
    //         }));
    //         return [...imagesWithType, ...videosWithType];
    //       });

    //     setMockupImages(combinedContent);
    //   } catch (error) {
    //     console.error("Error fetching mockup data:", error);
    //   }
    // };
    // fetchMockupData();

    const fetchSingleMockupData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${serverUrl}/api/v1/mockup-zones/mockupzone-paginate/${id}?imagePage=${imagePage}&videoPage=${videoPage}&imageLimit=18&videoLimit=3`
        );
        const data = await response.json();

        // Check if both images and videos are empty
        if (!data.images || !data.videos) {
          console.error("Invalid API response format:", data);
          setHasMore(false);
          return;
        }

        // Track if we've received new images or videos
        const receivedNewImages = data.images.length > 0;
        const receivedNewVideos = data.videos.length > 0;

        // Update our flags for whether there are more images or videos
        if (!receivedNewImages) setNoMoreImages(true);
        if (!receivedNewVideos) setNoMoreVideos(true);

        // If we have no more images AND no more videos, set hasMore to false
        if (!receivedNewImages && !receivedNewVideos) {
          setHasMore(false);
        }

        if (!searchParams.get("src") && data.images[0]) {
          setSearchParams({ type: "image", src: data.images[0] });
        }

        // Process the data to extract images and videos
        const combinedSingleContent = [data].flatMap((zone) => {
          const imagesWithType = zone.images.map((img) => ({
            type: "image",
            src: `${img}`,
          }));
          const videosWithType = zone.videos.map((vid) => ({
            type: "video",
            video: `${vid.video}`,
            thumbnail: `${vid.thumbnail}`,
          }));
          return [...imagesWithType, ...videosWithType];
        });

        // Only add new content if we received any
        if (combinedSingleContent.length > 0) {
          setSingleMockupZoneImages((prev) => [
            ...prev,
            ...combinedSingleContent,
          ]);
        }
      } catch (error) {
        console.error("Error fetching mockup data:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleMockupData();
  }, [imagePage, videoPage]);

  // Shuffle mockup images
  useEffect(() => {
    const shuffled = [
      ...(singleMockupZoneImages || []),
      // ...mockupImages.sort(() => 0.5 - Math.random()),
    ];
    setShuffledContent(shuffled);
    setSelectedContent({
      type: searchParams.get("type") || "image",
      src: searchParams.get("src"),
    });
  }, [singleMockupZoneImages]);

  const displayContent = (type, source) => {
    setSelectedContent({ type, src: source });
  };

  // Function to handle image click
  const handleImageClick = (image, id) => {
    navigate(`/work/${id}`);
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    // Load more content when user is near the bottom (within 10% of the bottom)
    if (scrollHeight - scrollTop <= clientHeight * 1.1 && !loading && hasMore) {
      // Only increment the pages that still have content
      if (!noMoreImages) setImagePage((prev) => prev + 1);
      if (!noMoreVideos) setVideoPage((prev) => prev + 1);
    }
  };

  const handleRecentWorkScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight * 1.1 &&
      !recentWorkLoading &&
      hasMoreRecentWorks
    ) {
      setRecentWorkPage((prev) => prev + 1);
    }
  };

  // Add this console.log to debug
  console.log("Recent Works:", recentWorks);

  if (!singleMockupZoneImages.length > 0) {
    return <Preloader />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex-grow flex flex-col">
        {/* Main Display Section */}
        <div className="h-[50vh] bg-black">
          {searchParams.get("type") === "video" && (
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              src={`${serverUrl}/` + searchParams.get("src")}
            />
          )}
          {searchParams.get("type") === "image" && (
            <Image
              width="100%"
              height="100%"
              className="w-full h-full object-cover"
              src={`${serverUrl}/` + searchParams.get("src")}
              alt="Image missing"
            />
          )}
        </div>

        {/* Thumbnail Section */}
        <div className="mt-[10px] grid grid-cols-4 gap-4 p-2">
          {/* Recent work section */}
          <div className="col-span-1">
            <h3 className="mb-3 text-xs bg-[#F15B26] sticky top-0 left-0 py-1.5 text-center text-white font-bold w-full shadow-md rounded-b">
              Recent work
            </h3>
            <div
              className="h-[345px] grid grid-cols-1 gap-2 overflow-y-scroll no-scrollbar relative rounded-b"
              onScroll={handleRecentWorkScroll}
            >
              {recentWorks &&
                recentWorks.map((work) => (
                  <div
                    key={work._id}
                    onClick={() => handleImageClick(work.images[0], work._id)}
                    className="shadow-md rounded"
                  >
                    <img
                      src={`${serverUrl}/${work.images[0]}`}
                      className="w-full h-14 object-cover rounded"
                      alt="Recent work"
                    />
                  </div>
                ))}
              {recentWorkLoading && (
                <div className="text-center py-2 text-black">Loading...</div>
              )}
            </div>
          </div>

          {/* Mockup zone section */}
          <div className="col-span-3">
            <h3 className="text-xs mb-3 bg-[#F15B26] sticky top-0 left-0 py-1.5 text-center text-white font-bold w-full shadow-md rounded-b">
              Mockup zone
            </h3>
            <div
              className="h-[345px]  grid grid-cols-3 gap-2 overflow-y-scroll no-scrollbar relative rounded-b"
              onScroll={handleScroll}
            >
              {shuffledContent.map((item) => (
                <div
                  key={item.id}
                  className="shadow-md rounded h-14"
                  onClick={() => {
                    setSearchParams({
                      src: item.type === "video" ? item.video : item.src,
                      type: item.type,
                    });
                    displayContent(
                      item.type,
                      item.type === "video" ? item.video : item.src // Updated to use src for images
                    );
                  }}
                >
                  <img
                    src={`${serverUrl}/${
                      item.type === "video" ? item.thumbnail : item.src
                    } `} // Updated to use src for images
                    className="w-full h-14 object-cover rounded"
                    alt={item.type}
                  />
                </div>
              ))}
              {loading && (
                <div className="col-span-3 text-center py-2 text-black">
                  Loading...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer className="mt-auto" />
    </div>
  );
};

export default Mockup;
