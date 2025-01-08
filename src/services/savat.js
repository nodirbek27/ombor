import axiosInstance from "./index";

const ep = "ombor/korzinka/";
const epPost = "ombor/korzinka_maxsulot/";

const get = () => axiosInstance.get(ep);
const getbyId = (id) => {
  return axiosInstance.get(`${ep}${id}/`);
};

const post = (item) => {
  return axiosInstance.post(epPost, item);
};
const put = (id, item) => {
  return axiosInstance.put(`${ep}${id}/`, item);
};
const del = (id) => {
  return axiosInstance.delete(`${ep}${id}/`);
};

const APISavat = { get, getbyId, post, put, del };

export default APISavat;
