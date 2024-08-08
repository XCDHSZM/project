import http from "../utils/request";

const processContent = async (content: string): Promise<string[]> => {
  try {
    const response = await http.request({
      url: "/books/apiAna", // 根据实际API调整
      method: "post", // 使用小写
      data: {
        content, // 传递内容
      },
    });

    return [response.data.level, response.data.age];
    // return ["10", "六年级上"]
  } catch (error) {
    console.error("There was an error!", error);
  }
};

export { processContent };
