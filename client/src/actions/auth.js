import * as api from "../api";
import { setCurrentUser } from "./currentUser";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export const login = (authData) => async (dispatch) => {
  try {
    const { data } = await api.login(authData);
    dispatch({ type: "AUTH", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem('Profile'))))
  } catch (error) {
    alert(error);
  }
};
