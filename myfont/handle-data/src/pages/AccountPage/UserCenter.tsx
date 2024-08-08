import { useLoginStore } from "@stores/index"; // 或你保存用户信息的地方
import React, { useState } from "react";
import { Typography, Card, Space, Tooltip } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./UserCenter.css";
const UserCenter = () => {
  const { userInfo } = useLoginStore();
  const [showPassword, setShowPassword] = useState(false); // 用于控制密码显示的状态

  const { Title, Text, Paragraph } = Typography;

  return (
    <Card
      style={{
        width: "800px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "30px",
      }}
    >
      <Title level={3} style={{ textAlign: "center" }}>
        用户中心
      </Title>
      <li className="Border">
        <Space className="Space">
          <strong
            className="Text"
            style={{ paddingRight: "65px", color: "grey" }}
          >
            用户名
          </strong>
          <Text className="Text">{userInfo.username}</Text>
        </Space>{" "}
      </li>
      <br />
      <li className="Border">
        <Space className="Space">
          <strong
            className="Text"
            style={{ paddingRight: "85px", color: "grey" }}
          >
            密码
          </strong>
          <Tooltip title="点击查看密码">
            <Text
              className="Text"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? userInfo.password : "••••••"}
            </Text>
          </Tooltip>
          {showPassword ? (
            <EyeTwoTone
              className="Text"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeInvisibleOutlined
              className="Text"
              style={{ color: "grey" }}
              onClick={() => setShowPassword(true)}
            />
          )}
        </Space>{" "}
      </li>
      <li className="Border">
        <br />
        <Space className="Space">
          <Text className="Text">
            <strong style={{ paddingRight: "50px", color: "grey" }}>
              用户类型
            </strong>
            <span className="Color">
              {userInfo.user_type === "Admin" ? "管理员" : "普通用户"}
            </span>
          </Text>
        </Space>
      </li>
      {/* <Space style={{ height: '80px' }}>
        <strong>用户名：</strong>
        <Text>{userInfo.username}</Text>
      </Space>{" "}
      <br />
      <Space>
        <strong>密码：</strong>
        <Tooltip title="点击查看密码">
          <Text onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? userInfo.password : "••••••"}
          </Text>
        </Tooltip>
        {showPassword ? (
          <EyeTwoTone onClick={() => setShowPassword(false)} />
        ) : (
          <EyeInvisibleOutlined onClick={() => setShowPassword(true)} />
        )}
      </Space>{" "}
      <br />
      <Space>
        <Text>
          <strong>用户类型：</strong>
          {userInfo.user_type === "Admin" ? "管理员" : "普通用户"}
        </Text>
      </Space> */}
    </Card>
  );
};
export default UserCenter;
