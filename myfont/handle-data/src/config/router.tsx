import React, { lazy } from "react";
import ErrorPage from "@components/ErrorPage";
import LoginPage from "../layout/components/Login";
import Register from "../layout/components/Register";
import App, { authLoader } from "../App";
import { createBrowserRouter, Navigate } from "react-router-dom";
import DataHandle from "@pages/DataHandle";
import {
  DashboardOutlined,
  EditOutlined,
  TableOutlined,
  BarsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import UserCenter from "@pages/AccountPage/UserCenter";
const Dashboard = lazy(() => import("../pages/Dashboard"));
const TablePage = lazy(() => import("../pages/TablePage"));
const AccountCenter = lazy(() => import("../pages/AccountPage/AccountCenter"));
const Sharerecord = lazy(() => import("../pages/AccountPage/Sharerecord"));
const AccountSettings = lazy(
  () => import("../pages/AccountPage/AccountSettings")
);
const CreateCenter = lazy(() => import("../pages/AccountPage/CreateCenter"));

const DetailPage = lazy(() => import("../pages/DetailPage"));
import BookDetailPage from "../pages/TablePage/components/BookDetailPage";
import path from "path";
import { title } from "process";
import { el } from "@faker-js/faker";
const UserManage = lazy(() => import("../pages/MyAdmin/UserManage"));
const DocUpLoad = lazy(() => import("../pages/MyAdmin/DocUpLoad"));
const Crawl = lazy(() => import("../pages/MyAdmin/crawlingData"));

const routes = [
  {
    path: "/",
    element: <DataHandle />,
    loader: authLoader,
    children: [
      {
        path: "dashboard",
      }
    ]
    // children: [
    //   {
    //     errorElement: <ErrorPage />,
    //     children: [
    //       {
    //         path: "detail",
    //         title: "阅读广场",
    //         icon: <BarsOutlined />,
    //         element: <DetailPage />,
    //       },
    //       {
    //         path: "table",
    //         title: "搜索中心",
    //         icon: <TableOutlined />,
    //         element: <TablePage />,
    //       },
    //       {
    //         path: "account",
    //         title: "个人页",
    //         icon: <UserOutlined />,
    //         children: [
    //           {
    //             path: "/account/share",
    //             title: "您的分享",
    //             element: <Sharerecord />,
    //           },
    //           {
    //             path: "/account/center",
    //             title: "创作历史",
    //             element: <AccountCenter />,
    //           },
    //           {
    //             path: "/account/create",
    //             title: "个人创作",
    //             element: <CreateCenter />,
    //           },
    //           {
    //             path: "/account/userCenter",
    //             title: "用户中心",
    //             element: <UserCenter />,
    //           },
    //         ],
    //       },
    //       {
    //         path: "Manage",
    //         title: "管理中心",
    //         icon: <EditOutlined />, // 你的管理员页面图标
    //         isAdminOnly: true, // 添加此字段，当此值为 true 时，表示这是仅供 Admin 访问的路由
    //         children: [
    //           {
    //             path: "/Manage/user",
    //             title: "用户管理",
    //             element: <UserManage />,
    //           },
    //           {
    //             path: "/Manage/doc",
    //             title: "文件上传",
    //             element: <DocUpLoad />,
    //           },
    //           {
    //             path: "/Manage/crawl",
    //             title: "文章获取",
    //             element: <Crawl />,
    //           },
    //         ],
    //       },
    //       {
    //         path: "*",
    //         element: <Navigate to="/" replace={true} />,
    //       },
    //     ],
    //   },
    // ],
  },
  // {
  //   path: "/login",
  //   element: <LoginPage />,
  // },
  // {
  //   path: "/register",
  //   element: <Register />,
  // },
  // {
  //   path: "table/book/:id",
  //   element: <BookDetailPage />,
  // },
];

export { routes };

export default createBrowserRouter(routes);
