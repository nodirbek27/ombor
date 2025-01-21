import axiosInstance from "./index";

const ep = "users/users/";

const getAll = () => {
  return axiosInstance.get(`${ep}`);
};

const get = (username, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosInstance.get(`${ep}?username=${username}`, config);
};

const getbyId = (id) => {
  return axiosInstance.get(`${ep}${id}`);
};

const post = (item) => {
  return axiosInstance.post(ep, item);
};
const put = (id, item) => {
  return axiosInstance.put(`${ep}${id}`, item);
};
const patch = (id, item) => {
  return axiosInstance.patch(`${ep}${id}/`, item);
};
const del = (id) => {
  return axiosInstance.delete(`${ep}${id}`);
};

const APIUsers = { getAll, get, getbyId, post, put, patch, del };

export default APIUsers;
