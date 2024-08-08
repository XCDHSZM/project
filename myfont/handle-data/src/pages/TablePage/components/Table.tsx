import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Spin } from "antd";
import { Link } from "react-router-dom"; // 导入 Link 组件
const TableComponent = ({ data, keyword }) => {
  const pageSize = 30; // 设置每页显示的条数
  const [loading, setLoading] = useState(false);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [filteredData, setFilteredData] = useState(data || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTriggered, setFilterTriggered] = useState(false);
  const fetchData = (page) => {
    setCurrentPage(currentPage); // 如果数据更新，重置到第一页
    setLoading(true);
    // 模拟延迟效果
    setTimeout(() => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;
      // setCurrentPageData(data.slice(startIndex, endIndex));
      setCurrentPageData(filteredData.slice(startIndex, endIndex)); // 使用filteredData进行分页
      setLoading(false);
    }, 500); // 延迟500毫秒模拟加载
  };
  useEffect(() => {
    if (!filteredData || filteredData.length === 0) {
      setFilteredData(data);
      // setLoading(true);
    }
    //有关键词的话，也需要重新设置数据
    if (keyword) {
      if (filterTriggered) {
        setFilteredData(filteredData);
      } else {
        setFilteredData(data);
      }
    }
    fetchData(currentPage);
    setFilterTriggered(false);
  }, [data, currentPage, filteredData]);

  const gradeConverter = (grade) => {
    const grades = [
      "一年级上",
      "一年级下",
      "二年级上",
      "二年级下",
      "三年级上",
      "三年级下",
      "四年级上",
      "四年级下",
      "五年级上",
      "五年级下",
      "六年级上",
      "六年级下",
    ];
    return grades[grade - 1] || "";
  };
  // 主题词处理函数
  const handleThemeWords = (themeWords) => {
    const words = themeWords.split(" ").filter((word) => word.trim() !== "");
    // const selected = words.slice(0, 8); // 选取前六个
    return words.map((word, index) => <Tag key={index}>{word}</Tag>); // 以标签形式返回
  };

  // 适用年级筛选逻辑，你可以根据需要添加或修改筛选条件
  const handleFilterChange = (filters) => {
    // 检查是否有筛选条件，如果没有，则重置为全部数据
    if (!filters || Object.keys(filters).length === 0) {
      setFilteredData(data);
      setFilterTriggered(false); // 没有触发筛选条件
    } else {
      // 根据筛选条件过滤数据
      const newFilteredData = data.filter((record) =>
        Object.entries(filters).every(
          ([key, value]) => record[key].toString() === value.toString()
        )
      );
      setFilteredData(newFilteredData);
      setFilterTriggered(true); // 触发了筛选条件
    }
    setCurrentPage(1); // 重置到第一页
  };
  // 定义列的配置
  const columns = [
    {
      title: "文本ID", // 列标题
      dataIndex: "id", // 列数据在数据项中对应的路径
      key: "id", // React的Key值，用于优化渲染性能
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "内容摘要",
      dataIndex: "content",
      key: "content",
      render: (text, record, index) => {
        const My_keyword = keyword;
        const startIndex = text.indexOf(My_keyword);
        if (My_keyword && startIndex !== -1) {
          const start = Math.max(0, startIndex - 3);
          const end = Math.min(text.length, startIndex + My_keyword.length + 3);
          const prefix = start > 0 ? "\u2026" : "";
          const suffix = end < text.length ? "\u2026" : "";
          const before = text.substring(start, startIndex);
          const after = text.substring(startIndex + My_keyword.length, end);

          // 注意这里用到了一个<mark>元素而不是一个字符串
          return (
            <div>
              {prefix}
              {before}
              <mark>{My_keyword}</mark>
              {after}
              {suffix}
            </div>
          );
        }

        if (text.length <= 9) {
          return text;
        }
        const len = text.length;
        const startPart = text.slice(len / 2 - 4, len / 2);
        const endPart = text.slice(len / 2, len / 2 + 5);
        return `\u2026${startPart}${endPart}\u2026`;
      },
    },
    // {
    //   title: "难度等级",
    //   dataIndex: "difficulty_level",
    //   key: "difficulty_level",
    //   sorter: (a, b) => a.difficulty_level - b.difficulty_level,
    //   sortDirections: ["descend", "ascend"],
    // },
    {
      title: "适用年级",
      dataIndex: "suitable_grade",
      key: "suitable_grade",
      render: (text) => gradeConverter(text),
      filters: [
        { text: "一年级上", value: "1" },
        { text: "一年级下", value: "2" },
        { text: "二年级上", value: "3" },
        { text: "二年级下", value: "4" },
        { text: "三年级上", value: "5" },
        { text: "三年级下", value: "6" },
        { text: "四年级上", value: "7" },
        { text: "四年级下", value: "8" },
        { text: "五年级上", value: "9" },
        { text: "五年级下", value: "10" },
        { text: "六年级上", value: "11" },
        { text: "六年级下", value: "12" },
        // 添加更多年级作为筛选条件
      ],
      onFilter: (value, record) =>
        record.suitable_grade != null
          ? record.suitable_grade.toString() === value
          : false,
    },
    {
      title: "主题词",
      dataIndex: "theme_words",
      key: "theme_words",
      render: (text) => <div>{handleThemeWords(text)}</div>,
    },
    {
      title: "操作",
      key: "operation",
      render: (_, record) => (
        <Link to={`/table/book/${record.id}`}>
          <Button>显示全文</Button>
        </Link>
      ),
    },
  ];
  // 当表格分页、筛选或排序变化时触发
  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current);
    handleFilterChange(filters);
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
              total: filteredData.length,
            }}
            onChange={handleTableChange}
          />
        </Spin>
      ) : isDataEmpty ? (
        // 如果 data 是空数组或未定义，则不显示表格
        <div></div>
      ) : (
        <Table
          columns={columns}
          dataSource={currentPageData}
          pagination={{
            pageSize,
            current: currentPage,
            total: filteredData.length,
          }}
          onChange={handleTableChange}
          rowKey="id"
        />
      )}
    </>
  );
};

export default TableComponent;
