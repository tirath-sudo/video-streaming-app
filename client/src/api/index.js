import axios from "axios";
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem("Profile")).token}`;
  }
  return req;
});

// User-related APIs
export const login = (payload) => API.post('/user/login', payload);
export const updateChanelData = (id, updateData) => API.patch(`/user/update/${id}`, updateData);
export const fetchAllChanel = () => API.get("/user/getAllChanels");
export const getPoints = (id) => API.get(`/user/getpoints/${id}`);
export const updatePoints = (id, updateData) => API.patch(`/user/updatePoints/${id}`);

// Video-related APIs
export const uploadVideo = (fileData, fileOptions) => API.post("/video/uploadVideo", fileData, fileOptions);
export const getVideos = () => API.get("/video/getvideos");
export const likeVideo = (id, Like) => API.patch(`/video/like/${id}`, { Like });
export const viewsVideo = (id) => API.patch(`/video/view/${id}`);
export const addToLikedVideo = (likedVideoData) => API.post("/video/likeVideo", likedVideoData);
export const getAlllikedVideo = () => API.get("/video/getAlllikeVideo");
export const deletelikedVideo = (videoId, Viewer) => API.delete(`/video/deleteLikedVideo/${videoId}/${Viewer}`);
export const addTowatchLater = (watchLaterData) => API.post("/video/watchLater", watchLaterData);
export const getAllwatchLater = () => API.get("/video/getAllwatchLater");
export const deleteWatchLater = (videoId, Viewer) => API.delete(`/video/deleteWatchlater/${videoId}/${Viewer}`);
export const addToHistory = (HistoryData) => API.post("/video/History", HistoryData);
export const getAllHistory = () => API.get("/video/getAllHistory");
export const deleteHistory = (userId) => API.delete(`/video/deleteHistory/${userId}`);
export const postComment = (CommentData) => API.post('/comment/post', CommentData);
export const deleteComment = (id) => API.delete(`/comment/delete/${id}`);
export const editComment = (id, commentBody) => API.patch(`/comment/edit/${id}`, { commentBody });
export const getAllComment = () => API.get('/comment/get');

// Video Call-related APIs
export const initiateCall = (data) => API.post("/videoCall/call", data);
export const answerCall = (data) => API.post("/videoCall/answer", data);
export const endCall = (data) => API.post("/videoCall/end", data);
export const startScreenShare = (data) => API.post("/videoCall/start-screen-share", data);
export const stopScreenShare = (data) => API.post("/videoCall/stop-screen-share", data);
export const startRecording = (data) => API.post("/videoCall/start-recording", data);
export const stopRecording = (data) => API.post("/videoCall/stop-recording", data);
