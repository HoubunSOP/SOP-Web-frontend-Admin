// api.js
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const api = axios.create({
  baseURL: "",
  timeout: 5000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response.data;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// 封装 POST 请求
export const post = async (endpoint, data) => {
  const status = {
    loading: true,
    error: false,
    completed: false,
  };

  try {
    const response = await api.post(endpoint, data);
    status.completed = true;
    return { response, status };
  } catch (error) {
    status.error = true;
    return { error, status };
  }
};

// 封装 PUT 请求
export const put = async (endpoint, data) => {
  const status = {
    loading: true,
    error: false,
    completed: false,
  };

  try {
    const response = await api.put(endpoint, data);
    status.completed = true;
    return { response, status };
  } catch (error) {
    status.error = true;
    return { error, status };
  }
};

// 封装 GET 请求
export const get = async (endpoint) => {
  const status = {
    loading: true,
    error: false,
    completed: false,
  };

  try {
    const response = await api.get(endpoint);
    status.completed = true;
    return { response, status };
  } catch (error) {
    status.error = true;
    return { error, status };
  }
};
