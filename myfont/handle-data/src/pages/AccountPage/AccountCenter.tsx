import { ProCard } from "@ant-design/pro-components";
import React, { useEffect, useState } from "react";
import { Avatar, Row, Col, Typography, message, Table, Button } from "antd";
import { useLoginStore } from "@stores/index";
import { getUserCreations } from "../../api/ContentAnalysis";
import { ReloadOutlined, ShareAltOutlined } from "@ant-design/icons"; // 导
// 入刷新图标
import "../../index.css";
import { shareCreations } from "../../api/ContentAnalysis";
const AccountCenter: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useLoginStore((state) => state.userInfo);
  const [creations, setCreations] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  const fetchData = () => {
    setIsLoading(true); // 开始显示加载状态
    // 使用 setTimeout 来模拟网络请求的延迟
    setTimeout(() => {
      getUserCreations({ username: userInfo.username })
        .then((data) => {
          setCreations(data);
          setIsLoading(false); // 数据加载完成，隐藏加载状态
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false); // 出错时，也需要隐藏加载状态
        });
    }, 1000); // 设置延迟为 1 秒 (1000 毫秒)
  };
  const handleShare = async () => {
    try {
      // 筛选出选中的创作，并准备包含全部信息的数组发送给后端
      const selectedCreations = creations.filter((creation) =>
        selectedRowKeys.includes(creation.id)
      );
      // 获取当前用户的用户名
      const username = userInfo.username;
      // 调用API函数分享这些创作
      const response = await shareCreations(selectedCreations, username);
      console.log("分享成功:", response);
      message.success("分享成功!");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // 如果是已知的业务逻辑错误（如重复分享），则显示后端返回的错误消息
        message.error(error.response.data.error);
      } else {
        // 对于其他类型的错误，显示通用错误消息
        message.error("分享失败，请稍后重试。");
      }
      console.error("分享失败：", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userInfo.username]);
  const columns = [
    {
      title: "创作内容",
      dataIndex: "content",
      key: "content",
      render: (text) => <div className="cellScroll">{text}</div>,
    },
    {
      title: "分析结果",
      dataIndex: "analysis_result",
      key: "analysis_result",
      render: (text) => <div className="cellScroll">{text}</div>,
    },
    {
      title: "创作时间",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (text) => {
        const date = new Date(text);
        const formattedDate =
          date.getFullYear() +
          "年" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "月" +
          ("0" + date.getDate()).slice(-2) +
          "日" +
          ("0" + date.getHours()).slice(-2) +
          ":" +
          ("0" + date.getMinutes()).slice(-2) +
          ":" +
          ("0" + date.getSeconds()).slice(-2);
        return <div>{formattedDate}</div>;
      },
    },
  ];
  return (
    <div style={{ width: "100%" }} className="detail-page-container">
      <Row
        style={{
          width: "100%",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
        gutter={[0, 20]}
      >
        {/* 刷新 */}
        <Col>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchData}
            style={{ marginRight: "16px" }}
          >
            刷新
          </Button>
        </Col>
        {/* 分享 */}
        <Col>
          <Button
            icon={<ShareAltOutlined />}
            onClick={handleShare}
            disabled={!selectedRowKeys.length}
          >
            分享
          </Button>
        </Col>
      </Row>
      {creations.length > 0 ? (
        <div
          style={{ overflowY: "auto", maxHeight: "400px" }}
          className="global-shadow global-shadow:hover"
        >
          {" "}
          {/* 或者使用calc(100vh - Xpx)来根据视口高度动态计算 */}
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={creations}
            rowKey={(record) => record.id}
            pagination={{ pageSize: 10 }}
            loading={isLoading}
          />
        </div>
      ) : (
        <Row>
          <div>
            <Col style={{ fontSize: "25px", fontWeight: "bold" }}>
              小朋友，你还没有创作哦，可以在个人创造中上传你的作品
            </Col>
          </div>
        </Row>
      )}
    </div>
  );
};

export default AccountCenter;
