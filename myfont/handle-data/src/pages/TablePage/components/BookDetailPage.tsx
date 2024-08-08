import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom"; // 导入 Link 组件
import {
  LikeOutlined,
  DislikeOutlined,
  HomeOutlined,
  ProfileOutlined,
  StarOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import {
  Row,
  Col,
  Spin,
  Card,
  Space,
  Tooltip,
  Button,
  Popover,
  message,
} from "antd";
import "../BookDetailPage.css";
import {
  SummerizeContent,
  labelContent,
  speakout,
} from "../../../api/BookDetails";
import RelatedContent from "./RelatedContent";
import { GetBookById } from "../../../api/GetRelatedContent";

const BookDetailPage = () => {
  const { id } = useParams(); // 使用 useParams 来获取路由参数中的 id
  const location = useLocation();
  // const { record } = location.state || {}; // 获取路由参数中的 state 数据
  const [record, setRecord] = useState({}); // 将摘要的内容存储在此状态变量中

  const [loading, setLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false); // 控制摘要是否正在进行
  const [summery, setSummery] = useState(""); // 将摘要的内容存储在此状态变量中
  const [showRecord, setShowRecord] = useState(false); // 控制是否显示record的状态
  const [insideCard, setInsideCard] = useState(false);
  // 状态
  const [markedContent, setMarkedContent] = useState(""); // 存储处理后的内容
  const [isMarking, setIsMarking] = useState(false); // 是否处于标记状态
  // 新增 summerized state，初始值为 false
  const [summerized, setSummerized] = useState(false);
  // Define state for checking if audio is playing
  const [isPlaying, setIsPlaying] = useState(true);

  // 样式
  const styles = {
    chengyu: {
      backgroundColor: "rgba(255,0,0,0.2)", // 红色背景透明度
      padding: "0 4px",
      borderRadius: "4px",
    },
    goodSentence: {
      backgroundColor: "rgba(0,0,255,0.2)", // 蓝色背景透明度
      padding: "0 4px",
      borderRadius: "4px",
    },
  };
  const fetchBooks = async (id) => {
    setLoading(true); // 开始请求图书，设置加载状态为 true
    try {
      // 等待 1s 然后发起请求
      await new Promise((resolve) => setTimeout(resolve, 600));
      const res = await GetBookById(id);
      if (res.length === 0) {
        message.error("没有找到相关书籍");
      } else {
        setRecord(res);
      }
    } catch (error) {
      message.error("没有找到相关书籍");
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setLoading(false); // 请求结束，设置加载状态为 false
    }
  };
  useEffect(() => {
    setMarkedContent("");
    setSummery(""); // Reset summary when id changes
    fetchBooks(id);
  }, [id]);

  useEffect(() => {
    fetchBooks(id);
    // 模拟延迟1秒后显示record的值
    const timer = setTimeout(() => {
      setShowRecord(true);
      setLoading(false); // 关闭加载状态
    }, 1000);

    return () => clearTimeout(timer); // 清除定时器
  }, []); // useEffect仅在组件挂载时执行
  const [tooltip, setTooltip] = useState(null); // tooltip 的状态
  // ...

  useEffect(() => {
    const handleMouseover = (event) => {
      const target = event.target;
      if (target.hasAttribute("data-definition")) {
        let definition = target.getAttribute("data-definition");
        // 存在 "解释：" 时才进行替换
        if (definition.includes("解释：")) {
          definition = definition.replace("解释：", "<strong>解释：</strong>");
        }
        // 存在 "典故：" 时才进行替换
        if (definition.includes("典故：")) {
          definition = definition.replace(
            "典故：",
            "<br /><br /><strong>典故：</strong>"
          );
        }
        setTooltip({
          definition: definition,
          pageX: event.pageX,
          pageY: event.pageY,
        });
      }
    };

    const handleMouseout = (event) => {
      let targetElement = event.relatedTarget;
      while (targetElement) {
        if (
          targetElement.className &&
          targetElement.className.includes("tooltip-card")
        ) {
          setInsideCard(true);
          return;
        }
        targetElement = targetElement.parentNode;
      }

      setTooltip(null);
      setInsideCard(false);
    };
    const handleMouseoverCard = () => {
      setInsideCard(true);
    };
    const handleMouseoutCard = () => {
      setInsideCard(false);
    };
    document.addEventListener("mouseover", handleMouseover);
    document.addEventListener("mouseout", handleMouseout);
    // 如果tooltip存在并且为一个DOM节点，则为它添加mouseover和mouseout事件处理器
    if (tooltip) {
      const tooltipDOM = document.querySelector(".ant-card");
      if (tooltipDOM) {
        tooltipDOM.addEventListener("mouseover", handleMouseoverCard);
        tooltipDOM.addEventListener("mouseout", handleMouseoutCard);
      }
    }

    return () => {
      document.removeEventListener("mouseover", handleMouseover);
      document.removeEventListener("mouseout", handleMouseout);
    };
  }, [tooltip]); // 仅在组件挂载和卸载时运行
  const handleCopy = () => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(tooltip.definition, "text/html");
    const text = htmlDoc.body.textContent || "";
    navigator.clipboard.writeText(text);
    message.success("复制成功！");
  };
  const Summerize = async () => {
    // 如果已经概括过一次，直接返回并提示
    if (summerized) {
      message.info("小朋友已经概述完成，请滚动鼠标滚轮查看概述内容");
      return;
    }
    // 如果已经概括过一次，直接返回并提示
    if (summerized) {
      message.info("小朋友已经概述完成，请滚动鼠标滚轮查看概述内容");
      return;
    }
    const MyContent = record.content;
    if (MyContent.length < 500) {
      message.info({
        content: (
          <span
            dangerouslySetInnerHTML={{
              __html:
                "小朋友，本文字数没有很多哦😊😊<br />再试着阅读一下吧✊✊",
            }}
          />
        ),
        duration: 2,
      });
      return;
    }
    try {
      setIsSummarizing(true); // 开始摘要
      // 调用SummerizeContent函数
      const response = await SummerizeContent({ content: MyContent });
      if (response) {
        // 假设response有一个ok属性来表示成功
        // 这里处理概括后的内容，例如显示给用户
        setSummery(response.data.summerize); // 将摘要的内容设置到状态变量中
        setSummerized(true);
        setSummerized(true);
        message.success("内容已成功概括🎉🎉🎉");
      }
    } catch (error) {
      // 错误处理
      message.error("内容概括失败");
      console.error("概括失败：", error);
    } finally {
      setIsSummarizing(false); // 摘要完成
    }
  };
  const handleLabel = async () => {
    const MyContent = record.content;
    try {
      setIsMarking(true); // 开始标记
      const response = await labelContent({ content: MyContent });
      // 检查成语和好句子是否都为空
      if (
        response &&
        response.data &&
        response.data.found_chengyus.length === 0 &&
        response.data.good_sentences.length === 0
      ) {
        message.info({
          content: (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  "小朋友，本文可能没有好词好句😭😭<br />但是依旧可以阅读一下哦✊✊",
              }}
            />
          ),
          duration: 2,
        });
        setIsMarking(false); // 结束标记
        return; // 早期返回，不再执行后面的代码
      }
      let processedContent = MyContent;
      // 标记成语
      response.data.found_chengyus.forEach((chengyu) => {
        const chengyuStyled = `<span style="background-color: rgba(255,0,0,0.2); padding: 0 4px; border-radius: 4px;" data-definition="${chengyu.definition}">${chengyu.corpus}</span>`;
        processedContent = processedContent.replace(
          chengyu.corpus,
          chengyuStyled
        );
      });
      // 标记佳句
      response.data.good_sentences.forEach((sentence) => {
        const sentenceStyled = `<span style="background-color: rgba(0,0,255,0.2); padding: 0 4px; border-radius: 4px;">${sentence}</span>`;
        processedContent = processedContent.replace(sentence, sentenceStyled);
      });
      setMarkedContent(processedContent); // 更新标记后的内容
    } catch (error) {
      message.error("内容标记失败");
      console.error("标记失败：", error);
    } finally {
      setIsMarking(false); // 结束标记
    }
  };
  const stopSpeakout = () => {
    window.speechSynthesis.cancel();
  };
  const speakIt = async () => {
    try {
      const MyContent = record.content;
      const response = await speakout({ content: MyContent });
      if (response.code === 200) {
        console.log(response.data);
        // const audio = new Audio(response.data.audio);  // 创建 audio 对象
        // audio.play();  // 播放音频
      } else {
        message.error("读取失败"); // message 需要从 antd 中导入：import { message } from 'antd';
      }
    } catch (error) {
      message.error("读取失败");
    }
  };
  return (
    // 要传入的数据：喇叭1、推荐2
    <div style={{ padding: 24 }} className="backgroundImage">
      <Link to={`/table`}>
        <Button style={{ marginBottom: "10px" }}>返回主页</Button>
      </Link>
      {loading ? (
        <Spin tip="加载中...">
          <div style={{ minHeight: 200 }} />
        </Spin>
      ) : (
        <div>
          <Row gutter={[16, 16]}>
            {" "}
            {/* 设置列之间的间距 */}
            {/* <Col span={12}>*/}
            <Col span={17}>
              {" "}
              {/* 左侧列，占据18列宽度 */}
              <div>
                <Card
                  className="cardShadow"
                  title="书籍详情"
                  style={{ width: "100%" }}
                  extra={
                    <Space size={15}>
                      <Tooltip title="本文概述">
                        <Button
                          type="primary"
                          icon={<ProfileOutlined />}
                          onClick={Summerize}
                          style={{ width: "60px" }}
                        />
                      </Tooltip>
                      <Tooltip title="本文赏析">
                        <Button
                          type="primary"
                          onClick={handleLabel}
                          icon={<StarOutlined />}
                          style={{ width: "60px" }}
                        />
                      </Tooltip>

                      <Tooltip title="朗读">
                        {/* <Button
                      type="primary"
                      //icon={<ProfileOutlined />}
                      //onClick={player}
                      style={{ width: "60px" }}
                    /> */}
                        <img
                          src="../../../src/static/player.jpg"
                          alt="player"
                          height="20px"
                          onClick={speakIt}
                        />
                      </Tooltip>
                    </Space>
                  }
                >
                  {showRecord && record ? (
                    <>
                      <p>
                        <strong>作者：</strong>
                        {record.author}
                      </p>
                      <p>
                        <strong>标题：</strong>
                        {record.title.replace(/[?|!]/g, "")}
                      </p>
                      <p>
                        <strong>内容：</strong>
                      </p>
                      <div
                        className="contentStyle"
                        style={{
                          maxHeight: "300px",
                          overflowY: "auto",
                          textIndent: "2em",
                          padding: "10px",
                        }}
                      >
                        {isMarking || !markedContent ? (
                          <p>{record.content}</p>
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{ __html: markedContent }}
                            className="fade-in"
                          ></div>
                        )}
                      </div>
                      <p>
                        <strong>难度等级：</strong>
                        {record.difficulty_level}
                      </p>
                    </>
                  ) : (
                    <p>未找到该书籍的详细信息</p>
                  )}
                </Card>
              </div>
            </Col>{" "}
            {/* <Col span={12}> */}
            <Col span={7}>
              {/* 右侧列，占据7列宽度 */}
              {record && "Related_IDS" in record ? (
                <RelatedContent relatedIds={record.Related_IDS} />
              ) : null}
            </Col>
          </Row>
          <Row>
            {" "}
            {/* <Col span={12}> */}
            <Col span={17}>
              {/* 左侧列，占据17列宽度 */}
              {isSummarizing ? (
                <Spin tip="内容概括中,可能时间有点长，请耐心等待😊😊😊...">
                  <div style={{ minHeight: 200 }} />
                </Spin>
              ) : null}
              {summery && (
                <Card
                  className="cardShadow"
                  title="内容概括"
                  style={{ width: "100%" }}
                >
                  {summery}
                </Card>
              )}
            </Col>
          </Row>
        </div>
      )}
      {/* Here is your Tooltip display */}
      {tooltip && (
        <Card
          className="tooltip-card"
          title="词语解释"
          style={{
            position: "absolute",
            left: tooltip.pageX,
            top: tooltip.pageY,
            zIndex: 1000,
            width: "500px",
          }}
          extra={
            <Tooltip title="复制到剪贴板">
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={handleCopy}
              />
            </Tooltip>
          }
        >
          <p dangerouslySetInnerHTML={{ __html: tooltip.definition }}></p>
        </Card>
      )}
    </div>
  );
};

export default BookDetailPage;
