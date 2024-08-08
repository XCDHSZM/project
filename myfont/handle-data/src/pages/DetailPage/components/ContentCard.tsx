import React, { useState } from "react";
import { Card, Space, Tooltip, Button, Typography, message } from "antd";
import useGlobalStore from "@stores/global";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { likeShare, dislikeShare } from "../../../api/ShareSquare";
import "../ContentCard.css";
const { Paragraph, Text } = Typography;

const ContentCard = ({ data }) => {
  const { primaryColor } = useGlobalStore();
  const [visibleCount, setVisibleCount] = useState(2); // 初始显示2条数据
  const [loading, setLoading] = useState(false); // 添加一个状态来跟踪加载状态
  const [userActions, setUserActions] = useState({}); // 新增状态来跟踪用户的点赞和踩行为
  const handleLoadMore = async () => {
    setLoading(true); // 开始加载数据时设置为 true
    // 模拟数据加载的异步过程
    setTimeout(() => {
      setVisibleCount((prevCount) => prevCount + 2); // 点击时显示2条更多的数据
      setLoading(false); // 加载完成后设置为 false
    }, 1000); // 假设加载数据需要1秒钟
  };
  const handleLike = async (itemId) => {
    if (userActions[itemId] === "liked") {
      message.info("你已经点过赞了！");
      return;
    } else if (userActions[itemId] === "disliked") {
      message.info("你已经踩过了，不能再点赞！");
      return;
    }
    try {
      const result = await likeShare(itemId);
      if (result) {
        message.success("点赞成功！");
        setUserActions({ ...userActions, [itemId]: "liked" });
      }
    } catch (error) {
      console.error("Error liking item:", error);
    }
  };

  const handleDislike = async (itemId) => {
    if (userActions[itemId] === "disliked") {
      message.info("你已经踩过了！");
      return;
    } else if (userActions[itemId] === "liked") {
      message.info("你已经点过赞了，不能再踩！");
      return;
    }
    try {
      const result = await dislikeShare(itemId);
      if (result) {
        message.success("踩了他一下！");
        setUserActions({ ...userActions, [itemId]: "disliked" });
      }
    } catch (error) {
      console.error("Error disliking item:", error);
    }
  };
  return (
    <div className="content-card-container">
      <div className="card-grid">
        {data.slice(0, visibleCount).map((item) => (
          <Card
            key={item.id || item.pk}
            title={item.username}
            headStyle={{
              backgroundColor: primaryColor,
              color: "#ffffff",
            }}
            extra={
              <Space>
                <Tooltip title="点赞">
                  <Button
                    type="primary"
                    icon={<LikeOutlined />}
                    onClick={() => handleLike(item.id)}
                  />
                </Tooltip>
                <Tooltip title="踩">
                  <Button
                    type="primary"
                    icon={
                      <DislikeOutlined onClick={() => handleDislike(item.id)} />
                    }
                  />
                </Tooltip>
              </Space>
            }
            className="content-card"
          >
            <Paragraph>
              <Text strong>分享内容:</Text>
              <br />
              {item.content}
            </Paragraph>
            <Paragraph>
              <Text strong>赏析结果:</Text>
              <br />
              {item.analysis_result}
            </Paragraph>
            <div className="card-footer">
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {`创作时间: ${new Date(
                  item.created_at
                ).toLocaleString()} | 分享时间: ${new Date(
                  item.shared_at
                ).toLocaleString()}`}
              </Text>
            </div>
          </Card>
        ))}
      </div>
      {visibleCount < data.length && (
        <div className="load-more">
          <Button type="primary" onClick={handleLoadMore} loading={loading}>
            加载更多
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentCard;
