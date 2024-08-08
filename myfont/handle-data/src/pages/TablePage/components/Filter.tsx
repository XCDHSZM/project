import React, { useState, useEffect } from "react";
import { Input, Select, Button, Row, Col, Modal, message } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import ReactWordcloud from "react-wordcloud";
import getWords from "../../../api/GetWords";
import "../BookDetailPage.css";
const Filter = ({ onSearch, onCollapseChange, onSetKeyword }) => {
  const initialWordCount = 20;
  const [collapsed, setCollapsed] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState("");
  const [title, setTitle] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [words, setWords] = useState<{ text: string; value: number }[]>([]);
  const [allkeys, setAllkeys] = useState<[]>([]);
  const [selectedWords, setSelectedWords] = useState([]);
  //const [Word, setWord] = useState<[]>([]);
  const handleSearch = () => {
    onSetKeyword({ keyword, status, title, selectedWords });
    onSearch({ keyword, status, title, selectedWords });
  };
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    onCollapseChange(!collapsed); // 通知外部折叠状态改变
  };

  const getAllwords = async () => {
    try {
      const fetchallkeys = await getWords(); // 获取allkeys
      if (fetchallkeys.length > 0) {
        setAllkeys(fetchallkeys);
      }
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };
  useEffect(() => {
    readWordsFromFile();
  }, [allkeys]);
  const readWordsFromFile = () => {
    const selectedWords = [];
    for (let i = 0; i < initialWordCount; i++) {
      const randomIndex = Math.floor(Math.random() * allkeys.length);
      selectedWords.push({ text: allkeys[randomIndex], value: 500 });
    }
    setWords(selectedWords);
  };
  useEffect(() => {
    // 从文件中读取词语数据
    getAllwords();
  }, []);
  const options = {
    fontSizes: [20, 40],
    rotations: 3,
    rotationAngles: [0, 60],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    spiral: "rectangular",
    enableTooltip: false,
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const onWordClick = (word) => {
    if (selectedWords.length > 7) {
      message.info("主题最多为7个");
      return;
    }
    if (selectedWords.includes(word.text)) {
      readWordsFromFile();
      return;
    }
    setSelectedWords((prevSelectedWords) => [...prevSelectedWords, word.text]); // 将选中的词语添加到数组中
    readWordsFromFile();
    // setIsModalVisible(false); // 选择主题后关闭模态框
  };
  const buttonClick = () => {
    readWordsFromFile();
  };
  const handleRemoveWords = (wordToRemove) => {
    setSelectedWords((prevSelectedWords) =>
      prevSelectedWords.filter((word) => word !== wordToRemove)
    );
    setTheme((currentTheme) =>
      currentTheme
        .split(" ")
        .filter((word) => word !== wordToRemove)
        .join(" ")
    );
  };
  const RemoveAll = () => {
    setSelectedWords([]);
  };
  return (
    <>
      <Button
        type="default"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        {collapsed ? <DownOutlined /> : <UpOutlined />} 折叠
      </Button>
      {!collapsed && (
        <>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              {/* 新增title的搜索框 */}
              <Input
                placeholder="标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Input
                placeholder="关键词"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Select
                value={status || undefined}
                onChange={(value) => setStatus(value)}
                placeholder="请选择难度"
                style={{ width: "100%" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              >
                <Select.Option value="">请选择</Select.Option>
                <Select.Option value="beginner">入门</Select.Option>
                <Select.Option value="easy">简单</Select.Option>
                <Select.Option value="intermediate">中等</Select.Option>
                <Select.Option value="hard">困难</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <div>
                <Input
                  placeholder={selectedWords.length > 0 ? "" : "主题词"}
                  value={theme || ""}
                  style={{ width: "100%", flex: 1 }}
                  onClick={() => setIsModalVisible(true)}
                  prefix={
                    // 动态生成带有删除功能的标签
                    <div style={{ maxWidth: "200px" }}>
                      {selectedWords.map((word) => (
                        <span
                          key={word}
                          style={{
                            cursor: "pointer",
                            marginRight: 5,
                            display: "inline-block",
                          }}
                          onClick={() => handleRemoveWords(word)} // 点击标签移除词语
                        >
                          {word}
                          <span style={{ marginLeft: 5 }}>×</span>
                        </span>
                      ))}
                    </div>
                  }
                />
              </div>
              <Modal
                title="请选择主题"
                visible={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
              >
                <ReactWordcloud
                  key={Date.now()}
                  words={words}
                  callbacks={{ onWordClick }}
                  options={options}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "20px",
                    bottom: "15px",
                  }}
                >
                  <button className="custom-button" onClick={buttonClick}>
                    下一页
                  </button>
                </div>
              </Modal>
            </Col>
          </Row>
          <Row gutter={16} justify="end" style={{ marginTop: 16 }}>
            <Col xs={24} sm={12} md={8} lg={6} xl={3}>
              <Button
                type="primary"
                onClick={handleSearch}
                style={{ width: "100%" }}
              >
                查询
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={3}>
              <Button
                onClick={() => {
                  setKeyword("");
                  setStatus("");
                  setTheme("");
                  RemoveAll();
                }}
                style={{ width: "100%" }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default Filter;
