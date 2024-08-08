import http from "../utils/request";

const getUserList = async (): Promise<any> => {
  try {
    const response = await http.request({
      url: "/users/userlist", // 根据实际API调整
      method: "get", // 使用小写
    });
    if (response.code !== 200) {
      throw new Error("Network response was not okr");
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error; // 抛出错误让调用者处理
  }
};

export default getUserList;
