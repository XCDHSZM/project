import React, { useState, useEffect } from "react";
import {
  Spin,
  Col,
  Row,
  message,
  Modal,
  List,
  Table,
  Upload,
  Button,
  Tooltip,
} from "antd";
import { useLoginStore } from "@stores/index"; // 或你保存用户信息的地方
import "./Admin.css";
import { processContent } from "../../api/GetDifficultyLevel";
import { KeysContent } from "../../api/KeysContent";
import { UpdateMysql } from "../../api/UpdataMySql";
import { table } from "console";
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
const DocUpLoad = () => {
  const { userInfo } = useLoginStore();
  if (userInfo.user_type != "Admin") {
    return <div>小朋友，你的权限尚且不够哦</div>;
  }
  // 否则，渲染管理员可以看到的部分
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [pretitle, setPreTitle] = useState("");
  const [preauthor, setPreAuthor] = useState("");
  const [precontent, setPreContent] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false); // 控制分析是否正在进行
  const [analysed, setAnalysed] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [dataFromAPI, setDataFromAPI] = useState<string[]>([]); // 用于存储后端处理结果
  const [keywords, setKeyWords] = useState<string[]>([]);
  // Add a new state for modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  //上传Json文件解析
  const [fileList, setFileList] = useState([]);
  const props = {
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (
            !json.hasOwnProperty("title") ||
            !json.hasOwnProperty("author") ||
            !json.hasOwnProperty("content")
          ) {
            throw new Error("Missing keys in JSON");
          }
          setTitle(json.title);
          setAuthor(json.author);
          setContent(json.content);
        } catch (err) {
          message.error("文件解析失败");
        }
      };
      reader.readAsText(file);
      setFileList([file]); // Upload the file
      return false; // Prevent antd from automatically uploading the file
    },
    onRemove: (file) => {
      setTitle("");
      setAuthor("");
      setContent("");
      setFileList([]); // Reset file list
    },
    fileList,
  };
  const columns = [
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "作者名",
      dataIndex: "author",
    },
    {
      title: "难度等级",
      dataIndex: "difficultyLevel",
    },
    {
      title: "适用年级",
      dataIndex: "gradeLevel",
    },
    {
      title: "关键词",
      dataIndex: "keywords",
    },
    {
      title: "内容",
      dataIndex: "content",
    },
  ];
  const data = [
    {
      key: "1",
      title: tableData[0],
      author: tableData[1],
      difficultyLevel: tableData[2],
      gradeLevel: tableData[3],
      keywords: tableData[4],
      // Add a default string for content if it is undefined
      content: `${(tableData[5] || "No content").substring(0, 20)}...`,
    },
  ];
  // 从API获取 文章难度等级、适用年级
  const fetchDataFromAPI = async (content) => {
    try {
      const data = await processContent(content); // 调用API函数
      setDataFromAPI(data); // 更新处理结果数组
    } catch (error) {
      console.error("There was an error!", error);
    }
  };
  const fetchKeywords = async (content: string) => {
    const data = await KeysContent(content);
    setKeyWords(data);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
  };

  const handleContentChange = (e) => {
    const lines = e.target.value.split(/(?<=\.)/g); // 分割输入的字符串
    const joinedLines = lines.join("\n"); // 使用换行符
    setContent(e.target.value);
  };
  //解析事件
  const handleButtonClick = async () => {
    if (!title || !author || !content) {
      message.info("请完成所有的内容");
      return;
    }
    if (content.length <= 15) {
      message.info("正文内容需大于15字");
      return;
    }
    if (
      analysed &&
      pretitle == title &&
      preauthor == author &&
      precontent == content
    ) {
      message.info("已完成解析");
      return;
    }
    setLoading(true); // 开始请求图书，设置加载状态为 true

    // await new Promise((resolve) => setTimeout(resolve, 500));
    setIsAnalysing(true);
    fetchDataFromAPI(content); // 在此处等待 Promise 解析
    fetchKeywords(content);
    setIsAnalysing(false);
  };
  useEffect(() => {
    if (loading && dataFromAPI.length > 0 && keywords.length > 0) {
      const inputTitle = title.trim() !== "" ? title : "";
      const inputAuthor = author.trim() !== "" ? author : "";
      const inputContent = content.trim() !== "" ? content : "";
      const click = 0;
      const url = "";
      const allData = [
        inputTitle,
        inputAuthor,
        dataFromAPI[0],
        dataFromAPI[1],
        keywords,
        inputContent,
      ];
      setTableData(allData);
      setAnalysed(true);
      setIsAnalysing(false);
      setShowTable(true);
      setPreTitle(title);
      setPreAuthor(author);
      setPreContent(content);
      setLoading(false);
    }
  }, [dataFromAPI, keywords]);

  const resetInputs = () => {
    setTitle("");
    setAuthor("");
    setContent("");
    setTableData([]);
    setAnalysed(false);
    setShowTable(false);
  };
  const handleSubmit = () => {
    // Show the modal when submit button clicked
    setIsModalVisible(true);
  };
  // Handle OK button click in Modal
  const handleOk = async () => {
    const data = {
      title: tableData[0],
      author: tableData[1],
      difficultyLevel: tableData[2],
      gradeLevel: tableData[3],
      keywords: tableData[4],
      // Trim content to first 20 characters and append ellipsis
      content: tableData[5],
    };
    try {
      // Call the API to save data here...
      const response = await UpdateMysql(data);
      if (response.error) {
        message.error("数据库中已经含有本文章");
      } else {
        message.info("上传成功了😊😄");
      }
    } catch (error) {
      console.error("Error while updating data:", error);
    }

    // Close the modal
    setIsModalVisible(false);
  };
  // Handle Cancel button click in Modal
  const handleCancel = () => {
    // Close the modal
    setIsModalVisible(false);
  };
  const ModalContent = () => (
    <List
      size="small"
      bordered
      dataSource={tableData}
      renderItem={(item, index) => (
        <List.Item>
          {index}: {item}
        </List.Item>
      )}
    />
  );

  return (
    <div>
      <Modal
        title="预览"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table columns={columns} dataSource={data} pagination={false} />
      </Modal>
      <Row>
        <Col span={14}>
          <div
            style={{
              background: "white",
              left: "40px",
              width: "500px",
              padding: "30px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              position: "relative",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  position: "relative",
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                作品上传
                <Tooltip title="这里可以直接粘贴文本或者上传json文件">
                  <InfoCircleOutlined
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "#1890ff",
                      transform: "translate(100%, -60%)",
                    }}
                  />
                </Tooltip>
              </h2>
            </div>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>上传json文件</Button>
            </Upload>

            <form style={{ display: "flex", flexDirection: "column" }}>
              <div>
                {/* <label>标题:</label> */}
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="请输入标题（1~50字）"
                  style={{
                    outline: "none",
                    fontSize: "20px",
                    fontWeight: "bold",
                    height: "75px ",
                    width: "100%",
                    borderRadius: "0",
                    borderTop: "0",
                    borderLeft: "0",
                    borderRight: "0",
                    borderBottom: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                {/* <label>作者:</label> */}
                <input
                  type="text"
                  value={author}
                  onChange={handleAuthorChange}
                  placeholder="请输入作者名"
                  style={{
                    outline: "none",
                    fontSize: "20px",
                    height: "75px ",
                    width: "100%",
                    padding: "8px",
                    borderRadius: "0",
                    borderTop: "0",
                    borderLeft: "0",
                    borderRight: "0",
                    borderBottom: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                {/* <label>正文:</label> */}
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder="请输入正文"
                  style={{
                    outline: "none",
                    height: "180px",
                    fontSize: "15px",
                    width: "100%",
                    borderRadius: "0",
                    border: "0",
                  }}
                />
              </div>
            </form>
            <button
              className="analyse-button"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "90px",
                borderRadius: "5px",
              }}
              onClick={handleButtonClick}
            >
              解析
            </button>
            <button
              className="analyse-button"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                borderRadius: "5px",
              }}
              onClick={resetInputs}
            >
              重置
            </button>
          </div>
        </Col>
        <Col span={6}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin style={{ whiteSpace: "nowrap" }} tip="加载中...">
                <div style={{ minHeight: 200 }} />
              </Spin>
            </div>
          ) : (
            <div>
              {isAnalysing ? (
                <Spin tip="正在解析，请耐心等待😊😊😊...">
                  <div style={{ minHeight: 200 }} />
                </Spin>
              ) : null}
              {tableData && showTable && (
                <div style={{ margin: "auto", left: "40px", width: "400px" }}>
                  <br />
                  <table
                    className="table"
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>标题</th>
                        <th>作者名</th>
                        <th>难度等级</th>
                        <th>适用年级</th>
                        <th>关键词</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {tableData.slice(0, 5).map((item, index) => (
                          <td key={index}>{item}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                  <button
                    className="analyse-button"
                    style={{
                      position: "relative",
                      top: "10px",
                      left: "330px",
                      //right: "2px",
                      borderRadius: "5px",
                    }}
                    onClick={handleSubmit}
                  >
                    提交
                  </button>
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DocUpLoad;
