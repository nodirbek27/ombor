import axiosInstance from "./index";

const ep = "ombor/kategoriya/";

const get = () => axiosInstance.get(ep);

const getbyName = (name) => {
  return axiosInstance.get(`${ep}?name=${name}`);
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

const APICategory = { get, getbyName, post, patch, del };

export default APICategory;
