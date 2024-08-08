import http from "../utils/request";

export async function ContentAnalysis({
  content,
  username,
}: {
  content: string;
  username: string;
}): Promise<any> {
  try {
    const response = await http.request({
      url: "/books/analysis", // 根据实际API调整
      method: "post", // 使用小写
      data: {
        content, // 传递内容
        username, // 传递用户名
      },
    });
    return response.data; // 返回解析结果
  } catch (error) {
    console.error("解析失败：", error);
    throw error; // 抛出错误，允许调用者处理
  }
}

export async function Saveanalysis({
  content,
  username,
  analysisResult,
}: {
  content: string;
  username: string;
  analysisResult: string;
}): Promise<any> {
  try {
    const response = await http.request({
      url: "/books/saveanalysis", // 根据实际API调整
      method: "post", // 使用小写
      data: {
        content, // 传递内容
        username, // 传递用户名
        analysisResult, // 传递解析结果
      },
    });
    return response.data; // 返回解析结果
  } catch (error) {
    console.error("解析失败：", error);
    throw error; // 抛出错误，允许调用者处理
  }
}

export async function getUserCreations({
  username,
}: {
  username: string;
}): Promise<any> {
  try {
    const response = await http.request({
      url: `/analysis/lists?username=${encodeURIComponent(username)}`, // 将用户名作为查询参数
      method: "get", // 获取用户创作，通常是GET请求
    });
    console.log(response.data);
    return response.data; // 假设响应数据在data属性中
  } catch (error) {
    console.error("获取用户创作历史失败：", error);
    throw error; // 抛出错误，允许调用者处理
  }
}

export async function shareCreations(
  selectedCreations: Array<any>,
  username: string
): Promise<any> {
  try {
    const response = await http.request({
      url: "/analysis/getshare", // 请根据实际API调整
      method: "post",
      data: {
        creations: selectedCreations, // 直接发送完整的创作信息
        username, // 发送用户名
      },
    });
    return response.data; // 返回后端响应
  } catch (error) {
    console.error("分享失败：", error);
    throw error; // 抛出错误，允许调用者处理
  }
}
