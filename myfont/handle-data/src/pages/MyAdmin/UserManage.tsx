import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Spin, Modal, Form, Select } from "antd";
import { Link } from "react-router-dom"; // 导入 Link 组件
import { useLoginStore } from "@stores/index"; // 或你保存用户信息的地方
import getUserList from "../../api/GetUserList";
import { updateUserPrivilege } from "../../api/userApi";
import { deleteUser } from "../../api/userApi";
import "./Admin.css";
const UserManage = () => {
  const { confirm } = Modal;
  const { Option } = Select;
  const { userInfo } = useLoginStore();
  if (userInfo.user_type != "Admin") {
    return <div>小朋友，你的权限尚且不够哦</div>;
  }
  // 否则，渲染管理员可以看到的部分
  const pageSize = 10; // 设置每页显示的条数
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false); // 是否显示编辑弹窗
  const [editingUser, setEditingUser] = useState(null); // 当前正在编辑的用户
  const [form] = Form.useForm();
  const GetData = async (searchParams = {}) => {
    setLoading(true);
    try {
      const fetchedData = await getUserList(); // 使用抽离的请求逻辑
      setData(fetchedData);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    GetData();
  }, []);
  const fetchData = (page) => {
    setCurrentPage(currentPage); // 如果数据更新，重置到第一页
    setLoading(true);
    // 模拟延迟效果
    setTimeout(() => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;
      setCurrentPageData(data.slice(startIndex, endIndex)); //对data进行分页
      // setCurrentPageData(filteredData.slice(startIndex, endIndex)); // 使用filteredData进行分页
      setLoading(false);
    }, 500); // 延迟500毫秒模拟加载
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [data, currentPage]);
  // 定义列的配置
  const columns = [
    // {
    //   title: "用户ID", // 列标题
    //   dataIndex: "id", // 列数据在数据项中对应的路径
    //   key: "id", // React的Key值，用于优化渲染性能
    // },
    {
      title: "用户名", // 列标题
      dataIndex: "username", // 列数据在数据项中对应的路径
      key: "username", // React的Key值，用于优化渲染性能
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "生日",
      dataIndex: "birthdate",
      key: "birthdate",
    },
    {
      title: "自我介绍",
      dataIndex: "introduction",
      key: "introduction",
      render: (text) => {
        if (text.length <= 20) {
          return text;
        }
        const Part = text.slice(0, 20);
        return <div>{Part}...</div>;
      },
    },
    {
      title: "身份",
      dataIndex: "is_admin",
      key: "is_admin",
      render: (text) => {
        const Identity = text;
        const End = Identity == true ? "管理员" : "普通用户";
        return <div>{End}</div>;
      },
    },
    {
      title: "操作",
      key: "operation",
      render: (_, record) => (
        <>
          <Button
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({
                privilege: record.is_admin ? "admin" : "regular",
              }); // 预设被编辑用户的权限
              setIsModalVisible(true);
            }}
            style={{ marginRight: "10px" }}
          >
            编辑
          </Button>
          <Button
            danger
            onClick={() => {
              handleDelete(record);
            }}
          >
            删除
          </Button>
        </>
      ),
    },
  ];
  const handleDelete = async (record) => {
    confirm({
      title: "你确定要删除这个用户吗?",
      content: "这个操作将会永久删除该用户的数据，不可恢复。",
      onOk: async () => {
        // 确认删除则执行删除操作
        try {
          await deleteUser(record.id);
          const dataCopy = [...data];
          const newData = dataCopy.filter((user) => user.id !== record.id);
          setData(newData);
        } catch (error) {
          console.error("Failed to delete user:", error);
        }
      },
      onCancel() {
        // 取消则不做任何事情
      },
    });
  };
  const handleSubmit = async () => {
    const values = await form.validateFields();
    const updatedPrivilege = values.privilege === "admin";
    try {
      await updateUserPrivilege(editingUser.id, updatedPrivilege);
      setIsModalVisible(false);
      const dataCopy = [...data]; // 创建 data 的副本
      const userToEdit = dataCopy.find((user) => user.id === editingUser.id); // 找到需要被修改权限的用户
      userToEdit.is_admin = updatedPrivilege; // 更新用户权限
      setData(dataCopy); // 设置新的 data，触发表格刷新
    } catch (error) {
      console.error("Failed to update user's privilege:", error);
    }
  };
  // 当表格分页、筛选或排序变化时触发
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };
  // 检查 data 是否为空数组或未定义
  const isDataEmpty = !data || data.length === 0;
  return (
    <>
      {loading ? (
        <Spin tip="加载中...">
          <Table
            columns={columns}
            dataSource={[]}
            pagination={{
              pageSize,
              current: currentPage,
              total: data.length,
            }}
            onChange={handleTableChange}
          />
        </Spin>
      ) : isDataEmpty ? (
        // 如果 data 是空数组或未定义，则不显示表格
        <div></div>
      ) : (
        <Table
          className="no-hover"
          columns={columns}
          dataSource={currentPageData}
          pagination={{
            pageSize,
            current: currentPage,
            total: data.length,
          }}
          onChange={handleTableChange}
          rowKey="id"
          rowClassName={(record) =>
            record.is_admin ? "admin-row" : "regular-row"
          }
        />
      )}
      <Modal
        title="编辑用户"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form}>
          <Form.Item
            name="privilege"
            label="权限"
            rules={[{ required: true, message: "请选择用户权限" }]}
          >
            <Select placeholder="请选择用户权限">
              <Option value="admin">管理员</Option>
              <Option value="regular">普通用户</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserManage;
