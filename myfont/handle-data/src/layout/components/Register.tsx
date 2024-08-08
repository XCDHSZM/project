import React, { useState } from "react";
import type { CascaderProps } from "antd";
import { message, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Tag, Tooltip } from "antd";
// 其他imports...
import { registerUser } from "../../api/userApi";
import "./layout.css";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const Register: React.FC = () => {
  const [showTip, setShowTip] = useState(false);

  const handleFocus = () => {
    setShowTip(true);
    setTimeout(() => setShowTip(false), 2500); // 2秒后隐藏提示
  };
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    // 在这里添加调用后端API的代码来处理注册
    // 这里用setTimeout模拟异步API调用
    try {
      const data = await registerUser({
        username: values.username,
        password: values.password,
        // male-->男
        //female-->女
        //
        introduction: values.intro,
        birthdate: values.birthdate.format("YYYY-MM-DD"), // 使用moment等库格式化日期
        gender: values.gender,
      });
      setTimeout(() => {
        message.success("注册成功🎉🎉🎉");
        navigate("/login", { replace: true });
      }, 500);
    } catch (error) {
      // 如果注册过程中发生错误，向用户展示错误消息
      message.error("注册失败，请重试。");
    }
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      scrollToFirstError
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "请输入你的用户名!",
          },
          {
            min: 5,
            message: "用户名至少需要5个字符",
          },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "用户名只能包含字母、数字和下划线",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: "请输入你的密码",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="确认密码"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "请确认你的密码",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The new password that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="intro"
        label="自我介绍"
        rules={[{ required: true, message: "请对自己进行简单介绍" }]}
      >
        <Input.TextArea showCount maxLength={100} />
      </Form.Item>
      <Form.Item
        name="birthdate"
        label="出生日期"
        rules={[
          {
            required: true,
            message: "请选择你的出生日期",
          },
        ]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="gender"
        label="性别"
        rules={[{ required: true, message: "请输入你的性别" }]}
      >
        <Select placeholder="选择你的性别">
          <Option value="男">男</Option>
          <Option value="女">女</Option>
          <Option value="其他">其他</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error("勾选同意")),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          请阅读<a href="">相关协议</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          注册
        </Button>
        <Button type="link" onClick={() => navigate("/login")}>
          已有帐号，点击登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
