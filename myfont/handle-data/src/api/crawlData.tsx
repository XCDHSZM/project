import http from "../utils/request";

const crawlUrl = async (
  input: string,
  start: number,
  end: number
): Promise<any> => {
  try {
    console.log("crawlUrl");
    console.log(input);
    console.log(start);
    console.log(end);
    const response = await http.request({
      url: "/books/crawl",
      method: "post",
      data: {
        url: input,
        start: start,
        end: end,
      },
    });
    console.log(response);
    if (response.code !== 200) {
      throw new Error("Network response was not ok");
    }
    const crawledData = response.data;

    return crawledData;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error; // 抛出错误让调用者处理
  }
};

export default crawlUrl;
