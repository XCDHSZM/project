import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Modal,
  Select,
  InputNumber,
  Space,
  message,
  Spin,
  Tooltip,
} from "antd";
import React, { useState, useEffect } from "react";
import crawlUrl from "../../api/crawlData";
const Crawl = () => {
  const { Option } = Select;
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "内容",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <p>{text.length > 20 ? text.substring(0, 20) + "..." : text}</p>
      ),
    },
    {
      title: "操作",
      key: "operation",
      render: (text, record) => (
        <Button onClick={() => handleDownload(record)}>下载</Button>
      ),
    },
  ];

  const handleDownload = (record) => {
    setModalContent(record);
    setVisible(true);
  };

  const handleOk = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(modalContent)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "download.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  //爬取数据
  const handlecrawl = async () => {
    setIsLoading(true); // Set isLoading to true before starting the request
    setIsLoadingData(true);
    try {
      if (start <= 0 || end <= 0 || end > 270) {
        message.error("请输入正确的范围");
        return;
      }
      const result = await crawlUrl(input, start, end);

      setData(result); // assuming the result is the data to be displayed
      setIsLoadingData(false);
    } catch (error) {
      console.error("An error occurred while crawling: ", error);
      // Handle error appropriately
    }
    setIsLoading(false); // Set isLoading to false after request is done
  };
  return (
    <div>
      <Row>
        <Col span={13}>
          <Select
            placeholder="请选择一个url"
            style={{ width: "100%" }}
            onChange={(value) => setInput(value)}
          >
            <Option value="https://www.yilinzazhi.com/">阅读刊物</Option>
            <Option value="https://so.gushiwen.cn/gushi/sanbai.aspx">
              古诗文
            </Option>
          </Select>
        </Col>
        <Space size={26} style={{ marginLeft: "20px" }}>
          <Col span={2}>
            <InputNumber
              min={1}
              max={269}
              value={start}
              placeholder="起始"
              onChange={(value) => setStart(value)}
            />
          </Col>
          <Col span={2}>
            <InputNumber
              min={start + 1}
              max={270}
              value={end}
              placeholder="中止"
              onChange={(value) => setEnd(value)}
            />
          </Col>
        </Space>
        <Col span={2} style={{ marginLeft: "20px" }}>
          <Tooltip title="古诗词和阅读刊物数据的起始和中止数值表示的意义不同">
            <Button type="primary" onClick={handlecrawl} loading={isLoading}>
              获取
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Spin spinning={isLoadingData}>
            {" "}
            {/* Wrap Table in Spin Component */}
            <Table columns={columns} dataSource={data} />
          </Spin>
        </Col>
      </Row>

      <Modal
        title="Download Content"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>标题: {modalContent.title}</p>
        <p>作者: {modalContent.author}</p>
        <p>
          内容:{" "}
          {modalContent.content &&
          typeof modalContent.content === "string" &&
          modalContent.content.length > 20
            ? modalContent.content.substring(0, 20) + "..."
            : modalContent.content}
        </p>
      </Modal>
    </div>
  );
};

export default Crawl;
