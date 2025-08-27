import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "./ShowVideo.css";

function ShowVideo({ vid }) {
  if (!vid) {
    return <p>No video selected</p>;
  }

  return (
    <>
      <Link to={`/videopage/${vid?._id}`}>
        <video
          src={vid.filePath} // ✅ Directly use Cloudinary URL
          className="video_ShowVideo"
          controls
          preload="metadata"
        />
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
