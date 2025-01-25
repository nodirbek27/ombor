import axiosInstance from "./index";

const ep = "ombor/birlik/";

const get = () => axiosInstance.get(ep);
const getbyId = (id) => {
    return axiosInstance.get(`${ep}${id}/`);
  };

const post = (item) => {
  return axiosInstance.post(ep, item);
};
const patch = (id, item) => {
    return axiosInstance.patch(`${ep}${id}/`, item);
  };
  const del = (id) => {
    return axiosInstance.delete(`${ep}${id}/`);
  };

const APIBirlik = { get, getbyId, post, patch, del };

export default APIBirlik;