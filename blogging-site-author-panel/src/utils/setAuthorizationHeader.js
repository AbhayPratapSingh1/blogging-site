import axios from 'axios';

export const setAuthorizationToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = token;
    axios.defaults.headers.common['Access-control-allow-credentials'] = true;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};