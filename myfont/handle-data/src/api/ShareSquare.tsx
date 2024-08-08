import http from "../utils/request";
const getShareList = async (): Promise<any> => {
  try {
    const response = await http.request({
      url: "/square/lists", // 根据实际API调整
      method: "get", // 使用小写
    });
    // console.log(response.data);
    // api/books/all
    if (response.code !== 200) {
      throw new Error("Network response was not ok");
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error; // 抛出错误让调用者处理
  }
};

export default getShareList;

// 发起点赞请求
export async function likeShare(itemId: number): Promise<any> {
  try {
    const response = await http.request({
      url: `/square/like/${itemId}/`, // 根据实际API调整
      method: "post",
    });

    if (response.code !== 200) {
      throw new Error("Failed to like the share");
    }

    return response.data; // 成功响应的数据
  } catch (error) {
    console.error("Failed to like share:", error);
    throw error; // 抛出错误让调用者处理
  }
}

// 发起踩请求
export async function dislikeShare(itemId: number): Promise<any> {
  try {
    const response = await http.request({
      url: `/square/dislike/${itemId}/`, // 根据实际API调整
      method: "post",
    });

    if (response.code !== 200) {
      throw new Error("Failed to dislike the share");
    }

    return response.data; // 成功响应的数据
  } catch (error) {
    console.error("Failed to dislike share:", error);
    throw error; // 抛出错误让调用者处理
  }
}
