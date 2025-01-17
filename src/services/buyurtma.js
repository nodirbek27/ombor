import axiosInstance from "./index";

const ep = "ombor/buyurtma/";
const epPost = "ombor/buyurtma_maxsulot/";

const get = () => axiosInstance.get(`${ep}`);

const getByUser = (unShifredId) =>
  axiosInstance.get(`${ep}?komendant_user=${unShifredId}`);

const getbyId = (id) => {
  return axiosInstance.get(`${ep}${id}/`);
};

const post = (item) => {
  return axiosInstance.post(epPost, item);
};
const put = (id, item) => {
  return axiosInstance.put(`${ep}${id}/`, item);
};
const patch = (id, item) => {
  return axiosInstance.patch(`${ep}${id}/`, item);
};
const del = (id) => {
  return axiosInstance.delete(`${ep}${id}/`);
};

const APIBuyurtma = { get, getByUser, getbyId, post, put, patch, del };

export default APIBuyurtma;
