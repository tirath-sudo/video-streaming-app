import * as api from "../api";

export const getPoints = (id) => async (dispatch) => {
  try {
    const { data } = await api.getPoints(id);
    console.log("Fetched Points Data:", data); 
    dispatch({ type: 'GET_POINTS', payload: data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updatePoints = (id, updateData) => async (dispatch) => {
  try {
    const { data } = await api.updatePoints(id, updateData);
    console.log("Updated Points Data:", data); 
    dispatch({ type: 'UPDATE_POINTS', payload: data });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
