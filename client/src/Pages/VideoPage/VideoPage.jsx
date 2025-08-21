import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Comments from "../../Components/Comments/Comments";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import "./VideoPage.css";
import { addToHistory } from "../../actions/History";
import { viewVideo } from "../../actions/video";
import { updatePoints } from "../../actions/Points";

function VideoPage() {
  const { vid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const CurrentUser = useSelector((state) => state?.currentUserReducer);
  const vidsState = useSelector((state) => state.videoReducer);

  const data = vidsState?.data || [];
  const vv = data.find((q) => q._id === vid) || null;

  const [pointsUpdated, setPointsUpdated] = useState(false);
  const videoRef = useRef(null);
  const commentSectionRef = useRef(null);

  // Next video logic (safe for empty lists)
  const currentVideoIndex = data.findIndex((q) => q._id === vid);
  const nextVideoIndex =
    data.length > 0 && currentVideoIndex >= 0
      ? (currentVideoIndex + 1) % data.length
      : -1;
  const nextVideo = nextVideoIndex >= 0 ? data[nextVideoIndex] : null;

  const handleHistory = useCallback(() => {
    if (!CurrentUser?.result?._id) return;
    dispatch(
      addToHistory({
        videoId: vid,
        Viewer: CurrentUser.result._id,
      })
    );
  }, [dispatch, vid, CurrentUser?.result?._id]);

  const handleViews = useCallback(() => {
    dispatch(
      viewVideo({
        id: vid,
      })
    );
  }, [dispatch, vid]);

  useEffect(() => {
    if (CurrentUser && vv) {
      handleHistory();
      handleViews();
      if (!pointsUpdated) {
        dispatch(updatePoints(CurrentUser?.result._id, { points: 5 }));
        setPointsUpdated(true);
      }
    }
  }, [CurrentUser, vv, vid, dispatch, pointsUpdated, handleHistory, handleViews]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const video = videoRef.current;

      
      if (!video) return;

      if (event.shiftKey) {
        if (event.key === ">") {
          video.playbackRate = (video.playbackRate || 1) + 0.5;
        } else if (event.key === "<") {
          video.playbackRate = Math.max(0.5, (video.playbackRate || 1) - 0.5);
        } else if (event.key === "G") {
          window.location.href = "https://www.google.com";
          event.preventDefault();
        }
      } else {
        if (event.key === "ArrowRight") {
          video.currentTime = (video.currentTime || 0) + 10;
        } else if (event.key === "ArrowLeft") {
          video.currentTime = Math.max(0, (video.currentTime || 0) - 10);
        } else if (event.key === "c") {
          commentSectionRef.current?.focus();
        } else if (event.key === "x") {
          alert("Window cannot be closed due to current browser settings");
        } else if (event.key === "l") {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const appid = "b6d38f62792ecb88f2a826edd4764185";
            fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}`
            )
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error(response.statusText);
                }
              })
              .then((data) => {
                const location = data.name;
                let temp = "";
                if (data.main) {
                  temp = (data.main.temp - 273.15).toFixed(2);
                } else {
                  temp = "Unknown";
                }
                alert(
                  `You are currently in ${location} and the temperature is ${temp}°C`
                );
              })
              .catch((error) => {
                if (
                  error.message ===
                  "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info."
                ) {
                  alert(
                    "Error: Invalid API key. Please check your API key and try again."
                  );
                } else {
                  alert("Error: " + error.message);
                }
              });
          });
        } else if (event.key === "n") {
          if (nextVideo) {
            navigate(`/videopage/${nextVideo._id}`);
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, nextVideo]);

  // If the requested video doesn't exist
  if (!vv) {
    return (
      <div className="container_videoPage">
        <div className="container2_videoPage">
          <p>Video not found.</p>
        </div>
      </div>
    );
  }

  // Built a correct local URL to the backend uploads
  let fileName = "";
  if (vv.filePath) {
    const parts = vv.filePath.split(/[/\\]/); 
    fileName = parts[parts.length - 1];
  }
  const videoUrl = fileName
    ? `http://localhost:5000/uploads/${encodeURIComponent(fileName)}`
    : "";

  return (
    <>
      <div className="container_videoPage">
        <div className="container2_videoPage">
          <div className="video_display_screen_videoPage">
            <video
              ref={videoRef}
              src={videoUrl}
              className={"video_ShowVideo_videoPage"}
              controls
            />
            <div className="video_details_videoPage">
              <div className="video_btns_title_VideoPage_cont">
                <p className="video_title_VideoPage"> {vv?.videoTitle}</p>
                <div className="views_date_btns_VideoPage">
                  <div className="views_videoPage">
                    {vv?.Views} views <div className="dot"></div>{" "}
                    {moment(vv?.createdAt).fromNow()}
                  </div>
                  <LikeWatchLaterSaveBtns vv={vv} vid={vid} />
                </div>
              </div>
              <Link
                to={`/chanel/${vv?.videoChanel}`}
                className="chanel_details_videoPage"
              >
                <b className="chanel_logo_videoPage">
                  <p>{vv?.Uploder?.charAt(0).toUpperCase()}</p>
                </b>
                <p className="chanel_name_videoPage">{vv?.Uploder}</p>
              </Link>
              <div
                className="comments_VideoPage"
                tabIndex={0}
                ref={commentSectionRef}
              >
                <h2>
                  <u>Comments</u>
                </h2>
                <Comments videoId={vv?._id} />
              </div>
            </div>
          </div>
          <div className="moreVideoBar">More video</div>
        </div>
      </div>
    </>
  );
}

export default VideoPage;
