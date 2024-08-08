import React, { useState } from "react";
import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  LoginFormPage,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Divider, message, Space, Tabs } from "antd";
import type { CSSProperties } from "react";
import { useLoginStore } from "@stores/index";
import { loginUser } from "../../api/userApi";

type LoginType = "phone" | "account";

const iconStyles: CSSProperties = {
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "18px",
  verticalAlign: "middle",
  cursor: "pointer",
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const Login = () => {
  const [loginType, setLoginType] = useState<LoginType>("account");
  const { setUserInfo } = useLoginStore();
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    loginUser(values)
      .then((response) => {
        // 登录成功逻辑
        message.success("登录成功🎉🎉🎉");
        // 这里假设 setUserInfo 是一个将用户信息保存到全局状态的函数
        // 将 response 的 user_type 属性添加到 values 对象中
        values = { ...values, user_type: response.user_type };
        setUserInfo(values); // 可能需要调整以使用实际的用户信息，而不是表单值
        // 直接使用 store 的 API 更新用户信息
        useLoginStore.getState().setUserInfo(values);
        navigate("/detail", { replace: true });
      })
      .catch((error) => {
        // 登录失败逻辑
        console.error("登录失败：", error);
        message.error("登录失败，请检查您的用户名和密码后重试。");
      });
  };
  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
        onFinish={onFinish as any}
        // title="YoungReaderHub"
        title={
          <div style={{ marginBottom: "98px" }}>
            <img
              src="/public/img/Young.png"
              alt="Logo"
              style={{ marginBottom: "10px", maxHeight: "100px" }}
            />
            <br />
            YoungReaderHubs
          </div>
        }
        subTitle="小学生阅读文章检索平台"
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={"account"} tab={"账号密码登录"} />
          <Tabs.TabPane key={"phone"} tab={"手机号登录"} />
        </Tabs>
        {loginType === "account" && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"用户名"}
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"密码"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            />
          </>
        )}
        {loginType === "phone" && (
          <>
            <ProFormText
              fieldProps={{
                size: "large",
                prefix: <MobileOutlined className={"prefixIcon"} />,
              }}
              name="mobile"
              placeholder={"手机号"}
              rules={[
                {
                  required: true,
                  message: "请输入手机号！",
                },
                {
                  pattern: /^1\d{10}$/,
                  message: "手机号格式错误！",
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              captchaProps={{
                size: "large",
              }}
              placeholder={"请输入验证码"}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${"获取验证码"}`;
                }
                return "获取验证码";
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: "请输入验证码！",
                },
              ]}
              onGetCaptcha={async () => {
                message.success("获取验证码成功！验证码为：1234");
              }}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: "right",
            }}
          >
            忘记密码
          </a>
        </div>
        <Button type="link" onClick={() => navigate("/register")}>
          没有账号？注册一个
        </Button>
        <hr />
      </LoginFormPage>
    </div>
  );
};

export default Login;
