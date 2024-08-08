import http from "../utils/request";

const KeysContent = async (content: string): Promise<string[]> => {
  try {
    const response = await http.request({
      url: "/books/keywords", // 根据实际API调整
      method: "post", // 使用小写
      data: {
        content, // 传递内容
      },
    });
    return [response.data.keys];
  } catch (error) {
    console.error("There was an error!", error);
  }
};

export { KeysContent };
