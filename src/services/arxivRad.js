import axiosInstance from "./index";

const ep = "ombor/rad_etilgan_maxsulotlar/";

const get = () => axiosInstance.get(ep);

const getByUser = (unShifredId) =>
  axiosInstance.get(`${ep}?buyurtma__komendant_user=${unShifredId}`);

const getbyId = (id) => {
  return axiosInstance.get(`${ep}${id}/`);
};

const post = (item) => {
  return axiosInstance.post(ep, item);
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

const APIArxivRad = { get, getByUser, getbyId, post, put, patch, del };

export default APIArxivRad;
