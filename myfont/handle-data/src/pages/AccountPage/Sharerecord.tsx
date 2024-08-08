import { ProCard } from "@ant-design/pro-components";
import { Table, Pagination, Button, Space, Divider } from "antd";
import getShareListByName from "../../api/GetShareByName";
import React, { useEffect, useState } from "react";
import ContentCard from "../DetailPage/components/ContentCard";
import { useLoginStore } from "@stores/index";
import "../../index.css";
const Sharerecord: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const userInfo = useLoginStore((state) => state.userInfo);

  // 抽离fetchData函数，使其可以被刷新按钮调用
  const fetchData = async () => {
    setLoading(true); // 开始加载数据前设置加载状态为true
    try {
      const result = await getShareListByName({
        username: userInfo.username,
      });
      setTimeout(() => {
        // 添加延迟模拟加载过程
        setData(result.data);
        setLoading(false); // 加载数据完成后设置加载状态为false
      }, 1000); // 延迟1秒
    } catch (error) {
      console.error("Failed to fetch share list:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({ current: page, pageSize: pageSize || 10 });
  };

  const getDataWithPagination = () => {
    const { current, pageSize } = pagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "内容", dataIndex: "content", key: "content" },
    { title: "喜欢", dataIndex: "likes", key: "likes" },
    { title: "不喜欢", dataIndex: "dislikes", key: "dislikes" },
  ];

  return (
    <div className="detail-page-container">
      <ProCard
        style={{ position: "relative", overflow: "auto" }}
        className="global-shadow"
      >
        {" "}
        {/* 确保ProCard可以处理溢出内容 */}
        {/* 刷新按钮容器 */}
        <div
          style={{ position: "absolute", top: "5px", right: "10px", zIndex: 2 }}
        >
          <Button type="primary" onClick={fetchData} loading={loading}>
            刷新
          </Button>
        </div>
        <Divider />
        <Table
          columns={columns}
          dataSource={getDataWithPagination()}
          loading={loading}
          pagination={false}
          rowKey="id"
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={data.length}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper
          showTotal={(total) => `共 ${total} 条`}
          style={{ textAlign: "right", marginTop: "10px" }}
        />
      </ProCard>
    </div>
  );
};

export default Sharerecord;
