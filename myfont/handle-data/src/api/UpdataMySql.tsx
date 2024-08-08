import http from "../utils/request";

const UpdateMysql = async (tableData): Promise<any> => {
  try {
    const response = await http.request({
      url: "/books/updatasql", // 根据实际API调整

      method: "post", // 使用小添加此行
      data: tableData, // 添加此行
    });
    return response.data; // 返回API响应的数据
  } catch (error) {
    console.error("There was an error!", error);
  }
};

export { UpdateMysql };
