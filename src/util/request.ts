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



import type {AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'


export interface SLRequestInterceptors<T = AxiosResponse> {
  // 请求成功
  requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  // 请求失败
  requestInterceptorCatch?: (error: any) => any
  // 响应成功
  responseInterceptor?: (res: T) => T
  // 响应失败
  responseInterceptorCatch?: (error: any) => any
}
// 导出SLRequestConfig给index的SLRequest类的constructor构造类传入参数是设置传参类型，
export interface SLRequestConfig<T = AxiosResponse> extends InternalAxiosRequestConfig {
  interceptors?: SLRequestInterceptors<T>
}


// 定义一个SLRequest 类用于发送axion的请求
class SLRequest {
  // 定义一个axion实例属性
  instance: AxiosInstance
  // 定义一个拦截器属性
  interceptors?: SLRequestInterceptors

  // 利用构造函数要求传入使用 ZYRequest类时传入参数
  constructor(config: SLRequestConfig) {
    // 把axios实例赋给instance
    this.instance = axios.create(config)

    // 把传入的拦截器赋值给interceptors
    this.interceptors = config.interceptors
    // 请求拦截
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    // 响应拦截
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )
    // 2.添加所有的实例都有的拦截器
    // 请求拦截
    this.instance.interceptors.request.use(
      (config) => {
        // console.log('所有的实例都有的拦截器: 请求成功拦截')
        return config
      },
      (err) => {
        console.log('所有的实例都有的拦截器: 请求失败拦截')
        return err
      }
    )
    // 响应拦截
    this.instance.interceptors.response.use(
      (res) => {
        // console.log('所有的实例都有的拦截器: 响应成功拦截'
        const data = res.data
        // 对返回的响应返回值进行判断，是否响应成功
        if (data.returnCode === '-1001') {
          console.log('请求失败~, 错误信息')
        } else {
          return data
        }
      },
      (err) => {
        console.log('所有的实例都有的拦截器: 响应失败拦截')
      
        // 例子: 判断不同的HttpErrorCode显示不同的错误信息
        if (err.response.status === 404) {
          console.log('404的错误~')
        }
        return err
      }
    )
  }
  request<T = any>(config: SLRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 1.单个请求对请求config的处理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }

      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 1.单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          // 将结果resolve返回出去
          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
          return err
        })
    })
  }
  // 定义发送请求的ts类型
  get<T = any>(config: SLRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }

  post<T = any>(config: SLRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }

  delete<T = any>(config: SLRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }

  patch<T = any>(config: SLRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}
