import { useEffect, useState } from "react";

const Consultancy = () => {
  let serverUrl = import.meta.env.VITE_SERVER_URL;
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    // Fetching video data from the API
    fetch(`${serverUrl}/api/v1/services`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setVideoData(data[0].video); // Assuming you want to use the first video
        }
      })
      .catch((error) => console.error("Error fetching video data:", error));
  }, []);

  if (!videoData) {
    return <p>Loading...</p>; // You can add a loading state while fetching
  }

  return (
    <div className="h-[48%] p-4">
      <video
        loop
        muted
        poster={`${serverUrl}/${videoData.thumbnail}`} // Use the thumbnail from the API
        className="w-full h-full object-cover rounded-md shadow-sm"
        controls
        src={`${serverUrl}/${videoData.url}`} // Use the video URL from the API
      />
    </div>
  );
};

export default Consultancy;
