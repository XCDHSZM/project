import http from "@utils/request";
export async function SummerizeContent({
  content,
}: {
  content: string;
}): Promise<any> {
  try {
    const response = await http.request({
      url: "/books/summerize", // 根据实际API调整
      method: "post", // 使用小写
      data: {
        content, // 传递内容
      },
    });
    return response; // 返回解析结果
  } catch (error) {
    console.error("概括失败：", error);
    throw error; // 抛出错误，允许调用者处理
  }
}

export async function labelContent({
  content,
}: {
  content: string;
}): Promise<any> {
  try {
    const response = await http.request({
      url: "/books/label", // 根据实际API调整
      method: "post", // 使用小写
      data: {
        content, // 传递内容
      },
    });
    return response; // 返回解析结果
  } catch (error) {
    console.error("标记失败：", error);
    throw error; // 抛出错误，允许调用者处理
  }
}

export async function speakout({ content }: { content: string }): Promise<any> {
  try {
    const response = await http.request({
      url: "/books/speak", // 根据实际API调整
      method: "post", // 使用小写
      data: {
        content, // 传递内容
      },
    });
    return response; // 返回解析结果
  } catch (error) {
    console.error("标记失败：", error);
    throw error; // 抛出错误，允许调用者处理
  }
}
