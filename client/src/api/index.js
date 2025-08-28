import axios from "axios";


const baseURL = process.env.REACT_APP_API_BASE_URL;

if (!baseURL) {
  // Fail fast in production – prevents silent localhost calls
  if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line no-console
    console.error(
      "[API] REACT_APP_API_BASE_URL is not set. " +
      "Configure it in your Vercel client project env to your server URL."
    );
  }
}

const API = axios.create({
  baseURL: baseURL || "http://localhost:5000",
  withCredentials: false, // using JWT in localStorage, not cookies
});

API.interceptors.request.use((req) => {
  const raw = localStorage.getItem("Profile");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        req.headers.authorization = `Bearer ${parsed.token}`;
      }
    } catch {
      // eslint-disable-next-line no-console
      console.warn("[API] Corrupt Profile in localStorage, ignoring.");
    }
  }
  return req;
});

// ✅ User-related APIs
export const login = (payload) =>
  API.post("/user/login", JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" },
  });

export const updateChanelData = (id, updateData) =>
  API.patch(`/user/update/${id}`, updateData);

export const fetchAllChanel = () => API.get("/user/getAllChanels");

export const getPoints = (userId) => API.get(`/user/getPoints/${userId}`);

export const updatePoints = (userId) => API.get(`/user/updatePoints/${userId}`);


// ✅ Video APIs
export const fetchAllVideo = () => API.get("/video/get");

export const uploadVideo = (formData) =>
  API.post("/video/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getVideos = () => API.get("/video/getVideos");
export const viewsVideo = () => API.get(`/video/viewsVideo/${videoId}`);
  
export const likeVideo = (videoId) => API.patch(`/video/like/${videoId}`);
export const watchLater = (videoId) => API.patch(`/video/watchlater/${videoId}`);
export const postView = (videoId, viewerId) =>
  API.post(`/video/view/${videoId}`, { viewerId });

export const addToHistory = (HistoryData) => API.post("/video/history", HistoryData);
export const getAllHistory = (userId) =>
  API.get(`/video/getHistory/${userId}`);
export const deleteHistory = (userId) =>
  API.delete(`/video/deleteHistory/${userId}`);

export const addToLikedVideo = (userId) => API.post("/video/addToLikedVideo", userId);
export const getAlllikedVideo = (userId) => API.get("/video/getAlllikedVideo", userId);
export const deletelikedVideo = (userId) => API.delete("/video/deletelikedVideo", userId);

export const addTowatchLater = (userId) => API.post("/video/addTowatchLater", userId);
export const getAllwatchLater = (userId) => API.get("/video/getAllwatchLater", userId);
export const deleteWatchLater = (userId) => API.delete("/video/deleteWatchLater", userId);


// ✅ Comments
export const postComment = (CommentData) =>
  API.post("/comment/post", CommentData);
export const deleteComment = (id) =>
  API.delete(`/comment/delete/${id}`);
export const editComment = (id, commentBody) =>
  API.patch(`/comment/edit/${id}`, { commentBody });
export const getAllComment = () => API.get("/comment/get");

// ✅ Video Call
export const initiateCall = (data) => API.post("/videoCall/call", data);
export const answerCall = (data) => API.post("/videoCall/answer", data);
export const endCall = (data) => API.post("/videoCall/end", data);
export const startScreenShare = (data) =>
  API.post("/videoCall/start-screen-share", data);
export const stopScreenShare = (data) =>
  API.post("/videoCall/stop-screen-share", data);
export const startRecording = (data) =>
  API.post("/videoCall/start-recording", data);
export const stopRecording = (data) =>
  API.post("/videoCall/stop-recording", data);


