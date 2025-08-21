import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";
import { MdPlaylistAddCheck } from "react-icons/md";
import {
  RiHeartAddFill,
  RiPlayListAddFill,
  RiShareForwardLine,
} from "react-icons/ri";
import "./LikeWatchLaterSaveBtns.css";

import { likeVideo } from "../../actions/video";
import { addTolikedVideo, deletelikedVideo } from "../../actions/likedVideo";
import { addTowatchLater, deleteWatchLater } from "../../actions/watchLater";

function LikeWatchLaterSaveBtns({ vv, vid }) {
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state?.currentUserReducer);

  const likedVideoList = useSelector((state) => state.likedVideoReducer);
  const watchLaterList = useSelector((state) => state.watchLaterReducer);

  const [isSaved, setIsSaved] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const likeCount = vv?.Like || 0;

  // Initialize buttons on mount
  useEffect(() => {
    if (!CurrentUser?.result?._id) return;

    const alreadyLiked = likedVideoList?.data?.some(
      (q) => q?.videoId === vid && q?.Viewer === CurrentUser?.result._id
    );
    setIsLiked(Boolean(alreadyLiked));

    const alreadySaved = watchLaterList?.data?.some(
      (q) => q?.videoId === vid && q?.Viewer === CurrentUser?.result._id
    );
    setIsSaved(Boolean(alreadySaved));
  }, [CurrentUser?.result?._id, likedVideoList?.data, watchLaterList?.data, vid]);

  const toggleSavedVideo = () => {
    if (!CurrentUser) {
      alert("Please login to save the video!");
      return;
    }

    if (isSaved) {
      setIsSaved(false);
      dispatch(deleteWatchLater({ videoId: vid, Viewer: CurrentUser?.result._id }));
    } else {
      setIsSaved(true);
      dispatch(addTowatchLater({ videoId: vid, Viewer: CurrentUser?.result._id }));
    }
  };

  const toggleLikeBtn = () => {
    if (!CurrentUser) {
      alert("Please login to like videos!");
      return;
    }

    if (isLiked) {
      setIsLiked(false);
      dispatch(likeVideo({ id: vid, Like: likeCount - 1 }));
      dispatch(deletelikedVideo({ videoId: vid, Viewer: CurrentUser?.result._id }));
    } else {
      setIsLiked(true);
      setIsDisliked(false);
      dispatch(likeVideo({ id: vid, Like: likeCount + 1 }));
      dispatch(addTolikedVideo({ videoId: vid, Viewer: CurrentUser?.result._id }));
    }
  };

  const toggleDislikeBtn = () => {
    if (!CurrentUser) {
      alert("Please login to dislike videos!");
      return;
    }

    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);

      // If already liked, undo the like
      if (isLiked) {
        dispatch(likeVideo({ id: vid, Like: likeCount - 1 }));
        dispatch(deletelikedVideo({ videoId: vid, Viewer: CurrentUser?.result._id }));
        setIsLiked(false);
      }
    }
  };

  return (
    <div className="btns_cont_videoPage">
      <div className="btn_VideoPage">
        <BsThreeDots />
      </div>

      <div className="btn_VideoPage">
        {/* Like */}
        <div className="like_videoPage" onClick={toggleLikeBtn}>
          {isLiked ? (
            <AiFillLike size={22} className="btns_videoPage" />
          ) : (
            <AiOutlineLike size={22} className="btns_videoPage" />
          )}
          <b>{likeCount}</b>
        </div>

        {/* Dislike */}
        <div className="like_videoPage" onClick={toggleDislikeBtn}>
          {isDisliked ? (
            <AiFillDislike size={22} className="btns_videoPage" />
          ) : (
            <AiOutlineDislike size={22} className="btns_videoPage" />
          )}
          <b>DISLIKE</b>
        </div>

        {/* Save / Watch later */}
        <div className="like_videoPage" onClick={toggleSavedVideo}>
          {isSaved ? (
            <>
              <MdPlaylistAddCheck size={22} className="btns_videoPage" />
              <b>Saved</b>
            </>
          ) : (
            <>
              <RiPlayListAddFill size={22} className="btns_videoPage" />
              <b>Save</b>
            </>
          )}
        </div>

        {/* Thanks (dummy for now) */}
        <div className="like_videoPage">
          <RiHeartAddFill size={22} className="btns_videoPage" />
          <b>Thanks</b>
        </div>

        {/* Share (dummy for now) */}
        <div className="like_videoPage">
          <RiShareForwardLine size={22} className="btns_videoPage" />
          <b>Share</b>
        </div>
      </div>
    </div>
  );
}

export default LikeWatchLaterSaveBtns;
