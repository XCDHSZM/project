import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "antd";
interface IRequestOptions {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
}
interface IResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
class HttpClient {
  private readonly instance: AxiosInstance;
  constructor(baseURL?: string) {
    this.instance = axios.create({ baseURL });
    this.instance.interceptors.response.use(
      this.handleSuccessResponse,
      this.handleErrorResponse
    );
  }
  private handleSuccessResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }
  private handleErrorResponse(error: any): Promise<never> {
    // message.error(error.message || "请求失败");
    return Promise.reject(error);
  }
  public async request<T = any>({
    url,
    method,
    data,
    params,
    headers,
  }: IRequestOptions): Promise<IResponse<T>> {
    const response = await this.instance.request<T>({
      url,
      method,
      data,
      params,
      headers,
    });
    return {
      code: response.status,
      message: response.statusText,
      data: response.data,
    };
  }
}

// 在request.ts文件中设置baseURL
// const http = new HttpClient("http://8.146.198.191:8000/api");
const http = new HttpClient("http://127.0.0.1:8000/api");

export default http;
