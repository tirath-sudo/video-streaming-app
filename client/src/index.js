import process from 'process';
import { Buffer } from 'buffer';

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";

import { applyMiddleware, compose } from "redux";
import { createStore } from "redux";
import { thunk } from "redux-thunk";
import Reducers from "./Reducers";
import { PointsProvider } from "./context/pointsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

window.process = process;
window.Buffer = Buffer;
window.global = window;

const store = createStore(Reducers, compose(applyMiddleware(thunk)));

const root = ReactDOM.createRoot(document.getElementById("root"));

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <PointsProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </PointsProvider>
    </React.StrictMode>
  </Provider>
);

reportWebVitals();
