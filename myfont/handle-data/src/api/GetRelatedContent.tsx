import http from "../utils/request";
export const GetRelatedContent = async (relatedIds = ""): Promise<any> => {
  try {
    const response = await http.request({
      url: "/books/getrelate", // 假设你的搜索API的路径是这样的
      method: "post",
      data: {
        relatedIds,
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

export const GetBookById = async (id = -1): Promise<any> => {
  try {
    const response = await http.request({
      url: "/books/getbyid", // 假设你的搜索API的路径是这样的
      method: "post",
      data: {
        id,
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
