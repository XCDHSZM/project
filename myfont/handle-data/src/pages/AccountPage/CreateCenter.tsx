import { ProCard } from "@ant-design/pro-components";
import React, { useState } from "react";

import {
  Avatar,
  Row,
  Col,
  Typography,
  Input,
  Button,
  Divider,
  Tooltip,
} from "antd";
import { useLoginStore } from "@stores/index";
import TextArea from "antd/es/input/TextArea";
import "./Account.css";
import { ContentAnalysis } from "../../api/ContentAnalysis";
import { Saveanalysis } from "../../api/ContentAnalysis";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import "../../index.css";
const CreateCenter: React.FC = () => {
  const navigate = useNavigate();
  const userInfo = useLoginStore((state) => state.userInfo);
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");

  const handleAnalysis = async () => {
    // 检查content是否为空或只包含空白字符
    if (!content.trim()) {
      message.info("小朋友，请先在文本框中写些内容哦。");
      return; // 直接返回，不执行后续的分析操作
    }
    setIsAnalyzing(true); // 开始分析
    try {
      const dataToSend = {
        content: content,
        username: userInfo.username, // 假设userInfo有一个username字段
      };
      const response = await ContentAnalysis(dataToSend);
      console.log("Analysis Result:", response);
      setAnalysisResult(response.analysis_result); // 更新状态以包含分析结果
      // 在这里更新解析结果的状态或执行其他操作
      setIsAnalyzing(false); // 分析完成
    } catch (error) {
      console.error("解析失败：", error);
      setIsAnalyzing(false); // 确保即使出错也能重置状态
    }
  };
  const handleSubmit = async () => {
    try {
      const dataToSend = {
        content: content,
        username: userInfo.username,
        analysisResult: analysisResult, // 确保你已经有了分析结果
      };
      const response = await Saveanalysis(dataToSend);
      if (response.ok) {
        message.success("保存成功🎉🎉🎉");
        navigate("/account/center"); // 跳转到account/center
      }
    } catch (error) {
      console.error("解析失败：", error);
    }
  };
  return (
    <ProCard
      wrap
      gutter={[0, 50]}
      layout="center"
      className="detail-page-container"
    >
      {/* 左侧文本区域 */}
      <Col
        span={12}
        style={{
          height: "100%",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
        }} // 调整样式
        className="global-shadow global-shadow:hover"
      >
        {/* <h3>输入文本</h3> */}
        <TextArea
          className="content-input"
          autoSize={{ minRows: 10, maxRows: 10 }}
          placeholder="在这里粘贴输入你想写的内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Divider />
        <Button
          type="primary"
          style={{ marginTop: "auto" }} // 自动调整到底部
          onClick={handleAnalysis}
        >
          解析
        </Button>
      </Col>
      {/* 右侧文本区域 */}
      <Col
        span={12}
        style={{
          height: "100%",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="content-analysis">
          <Typography.Title level={4}>解析结果：</Typography.Title>
          {isAnalyzing ? (
            <Typography.Paragraph>解析中...</Typography.Paragraph>
          ) : (
            <>
              <div className="analysis-result">
                <Typography.Paragraph>{analysisResult}</Typography.Paragraph>
              </div>
              <Divider />
              {analysisResult && (
                <Tooltip title="点击提交即可保存">
                  <Button
                    type="primary"
                    style={{ marginTop: "16px" }}
                    className="submit-button"
                    onClick={handleSubmit}
                  >
                    提交
                  </Button>
                </Tooltip>
              )}
            </>
          )}
        </div>
      </Col>
    </ProCard>
  );
};

export default CreateCenter;
