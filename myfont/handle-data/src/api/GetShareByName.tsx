import http from "../utils/request";
const getShareListByName = async ({
  username,
}: {
  username: string;
}): Promise<any> => {
  try {
    const response = await http.request({
      url: `/square/byname?username=${encodeURIComponent(username)}`,
      method: "get",
    });
    if (response.code !== 200) {
      throw new Error("Network response was not ok");
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error; // 抛出错误让调用者处理
  }
};

export default getShareListByName;
