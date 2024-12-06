import axiosInstance from "./index";

const ep = "ombor/talabnoma/";

const get = () => axiosInstance.get(ep);
const getbyId = (id) => {
    return axiosInstance.get(`${ep}${id}/`);
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

const APITalabnoma = { get, getbyId, post, put, del };

export default APITalabnoma;