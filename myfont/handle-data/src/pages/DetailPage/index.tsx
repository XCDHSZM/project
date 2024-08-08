import { ProCard } from "@ant-design/pro-components";
import getShareList from "../../api/ShareSquare";
import React, { useEffect, useState } from "react";
import ContentCard from "./components/ContentCard"; // 确保路径正确
import "./ContentCard.css";
const DetailPage: React.FC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // 添加一个状态来跟踪加载状态

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getShareList();
        // 使用setTimeout来模拟1秒的延迟
        setTimeout(() => {
          // 根据 likes 列降序排列数据
          result.data.sort((a, b) => b.likes - a.likes);
          setData(result.data);
          setLoading(false); // 更新状态为加载完成
        }, 1000); // 延迟1秒
      } catch (error) {
        console.error("Failed to fetch share list:", error);
        setLoading(false); // 即使失败，也应在1秒后更新加载状态
      }
    };

    fetchData();
  }, []);
  return (
    <div className="detail-page-container">
      {loading ? (
        <div style={{ fontSize: "20px" }}>正在加载数据...</div>
      ) : data && data.length ? (
        <ContentCard data={data} />
      ) : (
        <div>没有找到数据</div>
      )}
    </div>
  );
};

export default DetailPage;
