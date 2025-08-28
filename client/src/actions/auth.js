
import * as api from '../api'; 
import { setCurrentUser } from './currentUser';

export const login = ({ email }) => async (dispatch) => {
  try {
    
    console.log('[CLIENT] Sending login with email:', email);
    const { data } = await api.login({ email }); 
    console.log('[CLIENT] Login success:', data?.result?._id);

    
    localStorage.setItem('Profile', JSON.stringify(data));
    dispatch(setCurrentUser(data));
  } catch (err) {
    
    console.error('[CLIENT] Login failed:', err?.response?.status, err?.response?.data || err.message);
    throw err;
  }
};
