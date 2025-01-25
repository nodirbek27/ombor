import axiosInstance from "./index";

const ep = "ombor/korzinka/";
const epPost = "ombor/korzinka_maxsulot/";

const get = (unShifredId) =>
  axiosInstance.get(`${ep}?komendant_user=${unShifredId}`);

const getbyId = (id) => {
  return axiosInstance.get(`${ep}${id}/`);
};

const post = (item) => {
  return axiosInstance.post(epPost, item);
};
const patch = (id, item) => {
  return axiosInstance.patch(`${ep}${id}/`, item);
};
const delKorzinka = (id) => {
  return axiosInstance.delete(`${ep}${id}/`);
};
const delProduct = (id) => {
  return axiosInstance.delete(`${epPost}${id}/`);
};

const APISavat = { get, getbyId, post, patch, delKorzinka, delProduct };

export default APISavat;
