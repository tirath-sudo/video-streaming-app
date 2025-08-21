import React from "react";

function ShowVideo({ vid }) {
  if (!vid) {
    return <p>No video selected</p>;
  }

  // Extract just the filename if full path is passed
  let fileName = "";

  if (typeof vid === "string") {
    fileName = vid.split("\\").pop().split("/").pop(); // handles Windows/Unix paths
  } else if (vid.filename) {
    fileName = vid.filename;
  } else if (vid.filePath) {
    fileName = vid.filePath.split("\\").pop().split("/").pop();
  } else {
    console.error("Unexpected video format:", vid);
    return <p>Invalid video data</p>;
  }

  // Construct backend video URL
  const videoUrl = `http://localhost:5000/uploads/${fileName}`;

  return (
    <div>
      <video width="600" controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default ShowVideo;
