import http from "../utils/request";

const getWords = async (): Promise<any> => {
  try {
    const response = await http.request({
      url: "/books/allkeys", // 根据实际API调整
      method: "get", // 使用小写
    });
    if (response.code !== 200) {
      throw new Error("Network response was not ok");
    }
    const words = response.data;
    const randomWords = [];
    const totalWords = words.length;
    const numToSelect = Math.min(totalWords, 2000); // 确保不超过总词数

    while (randomWords.length < numToSelect) {
      const randomIndex = Math.floor(Math.random() * totalWords);
      randomWords.push(words[randomIndex]);
    }

    return randomWords;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error; // 抛出错误让调用者处理
  }
};

export default getWords;
