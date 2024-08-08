// userService.ts

import http from "../utils/request";

const getNovelList = async (): Promise<any> => {
  try {
    const response = await http.request({
      url: "/books/all", // 根据实际API调整
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

export default getNovelList;
export const getNovelsByKeyword = async (
  keyword = "",
  status = "",
  title = "",
  selectedWords = []
): Promise<any> => {
  try {
    const response = await http.request({
      url: "/books/searchBykeyword", // 假设你的搜索API的路径是这样的
      method: "post",
      data: {
        keyword,
        status,
        title,
        selectedWords,
      },
    });
    if (response.code !== 200) {
      throw new Error("Network response was not ok");
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error;
  }
};
