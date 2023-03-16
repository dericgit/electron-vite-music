import axios from "axios";
import { pinia } from '../plugins/pinia';
import { notification, message } from "ant-design-vue";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://dericgit.vercel.app";

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  (config) => {
    if (!store.state.App.isOnline) {
      return Promise.reject(new Error("offline!"));
    }
    return config;
  },
  (error) => {
    Message.error(error);
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.code && response.code === 200) {
      return response;
    }
    message.warn(response.msg || response.statusText || "Response error");
    return Promise.reject(response);
  },
  (error) => {
    if (error.response) {
      let res = error.response;
      switch (res.status) {
        case 301:
          pinia.commit("User/SET_SHOW_LOGIN", true);
          pinia.commit("User/SET_USER_INFO", {});
          pinia.commit("App/SET_REDIRECT", "/home");
          localStorage.removeItem("userId");
          message.warn(res.msg || "请先登录");
          break;
        case 400:
          message.warn(res.message || res.msg || "资源不在收藏列表中");
          break;
        case 401:
          store.commit("User/SET_SHOW_LOGIN", true);
          store.commit("User/SET_USER_INFO", {});
          store.commit("App/SET_REDIRECT", "/home");
          localStorage.removeItem("userId");
          message.warn(res.msg || "请先登录");
          break;
        case 403:
          message.error(res.msg || "权限不足");
          break;
        case 404:
          message.error(res.msg || "请求资源不存在");
          break;
        case 408:
          message.error(res.message || "已经收藏过该视频");
          break;
        case 500:
          message.error(res.msg || "服务器开小差啦");
          break;
        case 504:
          message.error(res.msg || "网络请求失败");
          break;
        default:
          message.error(res.msg || res.statusText);
      }
    } else {
      notification.open({
        message: "请检查网络连接状态",
        description: "请检查网络连接状态",
        style: {
          width: "600px",
          marginLeft: `${335 - 600}px`,
        },
        class: "notification-custom-class",
      });
    }
    return Promise.reject(error.response);
  }
);

export default instance;
