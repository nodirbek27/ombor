import axiosInstance from "./index";

const ep = "ombor/talabnoma/";

const get = () => axiosInstance.get(ep);

const getByUser = (unShifredId) =>
  axiosInstance.get(`${ep}?buyurtma__komendant_user=${unShifredId}`);

const getByUserActive = (unShifredId) =>
  axiosInstance.get(`${ep}?buyurtma__komendant_user=${unShifredId}&active=true`);

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

const APITalabnoma = { get, getByUser, getByUserActive, getbyId, post, patch, del };

export default APITalabnoma;
