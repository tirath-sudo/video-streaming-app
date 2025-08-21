import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "./ShowVideo.css";

function ShowVideo({ vid }) {
  if (!vid) {
    return <p>No video selected</p>;
  }

  // --- Safe filename extraction (handles string/object + Win/Unix paths)
  const getFileName = (v) => {
    if (!v) return "";
    if (typeof v === "string") {
      const parts = v.split(/[/\\]/);
      return parts[parts.length - 1] || "";
    }
    if (v.filename) {
      const parts = String(v.filename).split(/[/\\]/);
      return parts[parts.length - 1] || "";
    }
    if (v.filePath) {
      const parts = String(v.filePath).split(/[/\\]/);
      return parts[parts.length - 1] || "";
    }
    return "";
  };

  const fileName = getFileName(vid);
  if (!fileName) {
    console.error("ShowVideo: could not derive filename from vid:", vid);
    return <p>Invalid video data</p>;
  }

  // --- Backend base (env override optional), encode filename for safety
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
  const videoURL = `${API_BASE}/uploads/${encodeURIComponent(fileName)}`;

  return (
    <>
      <Link to={`/videopage/${vid?._id}`}>
        <video src={videoURL} className="video_ShowVideo" controls preload="metadata" />
      </Link>

      <div className="video_description">
        <div className="Chanel_logo_App">
          <div className="fstChar_logo_App">
            {vid?.Uploder?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>

        <div className="video_details">
          <p className="title_vid_ShowVideo">{vid?.videoTitle}</p>
          <pre className="vid_views_UploadTime">{vid?.Uploder}</pre>
          <pre className="vid_views_UploadTime">
            {vid?.Views} views <div className="dot"></div>{" "}
            {moment(vid?.createdAt).fromNow()}
          </pre>
        </div>
      </div>
    </>
  );
}

export default ShowVideo;
