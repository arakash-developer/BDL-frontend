import React from "react";

const ReviewDisplay = ({ review }) => {
  if (!review) {
    return <div>No review submitted yet.</div>;
  }

  const { text, image } = review;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
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
        <p className="text-gray-700">{text}</p>
      </div>

      {image && (
        <div className="mb-4">
          {image.type.startsWith("image/") ? (
            <img src={image.url} alt="Review media" className="max-h-40" />
          ) : (
            <video controls className="max-h-40">
              <source src={image.url} type={image.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;
