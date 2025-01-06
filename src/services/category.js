import axiosInstance from "./index";

const ep = "ombor/kategoriya/";

const get = () => axiosInstance.get(ep);

const getbyName = (name) => {
  return axiosInstance.get(`${ep}?name=${name}`);
};

const post = (item) => {
  return axiosInstance.post(ep, item);
};
const put = (id, item) => {
  return axiosInstance.put(`${ep}${id}/`, item);
};
const del = (id) => {
  return axiosInstance.delete(`${ep}${id}/`);
};

const APICategory = { get, getbyName, post, put, del };

export default APICategory;
