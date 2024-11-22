import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();

let baseURL = "https://api.fwgxt.top/api";

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  baseURL = "http://127.0.0.1:8000";
}

const api = axios.create({
  baseURL: baseURL,
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
    const token = getAccessTokenFromCookie(); // 获取访问令牌
    const response = await api.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${token}`, // 添加 Authorization Bearer 头部
      },
    });
    status.completed = true;
    return { response, status };
  } catch (error) {
    if (error.response.status === 401) {
      const errorMessage = error.response.data.message;
      if (errorMessage === "您并没有权限这样做") {
        toast.error("您没有权限访问此页面，请登录");
        deleteAccessTokenCookie();
        router.push("/login");
      }
    }
    status.error = true;
    toast.error("无法post数据，错误url：" + endpoint);
    return { error, status };
  }
};

export const put = async (endpoint, data) => {
  const status = {
    loading: true,
    error: false,
    completed: false,
  };

  try {
    const token = getAccessTokenFromCookie(); // 获取访问令牌
    const response = await api.put(endpoint, data, {
      headers: {
        Authorization: `Bearer ${token}`, // 添加 Authorization Bearer 头部
      },
    });
    console.log("PUT 请求成功");
    status.completed = true;
    return { response, status };
  } catch (error) {
    // 默认返回一个响应结构，即使出错时也不为空
    const response = error.response || { status: 500, data: null };

    // 错误处理逻辑
    if (response.status === 401) {
      const errorMessage = response.data?.message || "未授权的请求";
      if (errorMessage === "您并没有权限这样做") {
        toast.error("您没有权限访问此页面，请登录");
        deleteAccessTokenCookie();
        router.push("/login");
      }
    }
    status.error = true;
    console.error("PUT 请求失败：", error);

    // 返回错误时也保持结构一致
    return { response, status };
  }
};


// 封装 delete 请求
export const deleter = async (endpoint) => {
  const status = {
    loading: true,
    error: false,
    completed: false,
  };

  try {
    const token = getAccessTokenFromCookie(); // 获取访问令牌
    const response = await api.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`, // 添加 Authorization Bearer 头部
      },
    });
    status.completed = true;
    return { response, status };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data.message;
      if (errorMessage === "您并没有权限") {
        toast.error("您没有权限访问此页面，请登录");
        deleteAccessTokenCookie();
        router.push("/login");
      }
    }
    status.error = true;
    toast.error("无法put数据，错误url：" + endpoint);
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
    toast.error("无法get数据，错误url：" + endpoint);
    return { error, status };
  }
};
// 保存cookies

// 设置access_token到Cookie
export function setAccessTokenCookie(token, remember) {
  const expires = new Date();
  if (remember) {
    expires.setFullYear(expires.getFullYear() + 100); // 设置过期时间为 100 年
  }
  expires.setDate(expires.getDate() + 1); // 设置过期时间为1天

  const cookieValue =
    encodeURIComponent(token) +
    "; expires=" +
    expires.toUTCString() +
    "; path=/";
  document.cookie = "access_token=" + cookieValue;
}

// 从Cookie中获取access_token
export function getAccessTokenFromCookie() {
  const name = "access_token" + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return decodeURIComponent(cookie.substring(name.length, cookie.length));
    }
  }
  return null;
}

// 删除 access_token Cookie
export function deleteAccessTokenCookie() {
  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
