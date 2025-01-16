import axiosInstance from "./index";

const ep = "ombor/korzinka/";
const epPost = "ombor/korzinka_maxsulot/";

const get = (komendant_user) =>
  axiosInstance.get(`${ep}?komendant_user=${komendant_user}`);

const getbyId = (id) => {
  return axiosInstance.get(`${ep}${id}/`);
};

const post = (item) => {
  return axiosInstance.post(epPost, item);
};
const put = (id, item) => {
  return axiosInstance.put(`${ep}${id}/`, item);
};
const delKorzinka = (id) => {
  return axiosInstance.delete(`${ep}${id}/`);
};
const delProduct = (id) => {
  return axiosInstance.delete(`${epPost}${id}/`);
};

const APISavat = { get, getbyId, post, put, delKorzinka, delProduct };

export default APISavat;
