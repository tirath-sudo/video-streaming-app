import { Link } from "react-router-dom";
import moment from "moment";

function ShowVideo({ vid }) {
  let normalizedFilePath = vid.filePath.replace(/\\/g, "/");

  // ✅ Ensure path includes /uploads
  if (!normalizedFilePath.startsWith("/uploads")) {
    normalizedFilePath = "/uploads/" + normalizedFilePath;
  }

  // ✅ Use local backend URL (where Express is running)
  const videoURL = `http://localhost:5000${normalizedFilePath}`;

  return (
    <>
      <Link to={`/videopage/${vid?._id}`}>
        <video 
          src={videoURL}
          className="video_ShowVideo"
          controls
        />
      </Link>
      <div className='video_description'>
        <div className='Chanel_logo_App'>
          <div className='fstChar_logo_App'>
            <>{vid?.Uploder?.charAt(0).toUpperCase()}</>
          </div>
        </div>
        <div className='video_details'>
          <p className='title_vid_ShowVideo'>{vid?.videoTitle}</p>
          <pre className='vid_views_UploadTime'>{vid?.Uploder}</pre>
          <pre className='vid_views_UploadTime'>
            {vid?.Views} views <div className="dot"></div> {moment(vid?.createdAt).fromNow()}
          </pre>
        </div>
      </div>
    </>
  );
}

export default ShowVideo;
