import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Table from "./components/Table";
import { message, Spin } from "antd";
import getNovelList from "../../api/GetNovelList";
import { getNovelsByKeyword } from "../../api/GetNovelList";
const IndexPage = () => {
  const [data, setData] = useState([]);
  const [filterHeight, setFilterHeight] = useState("150px");
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const handleSearch = async (searchParams = {}) => {
    setLoading(true);
    try {
      const fetchedData = await getNovelList(); // 使用抽离的请求逻辑
      setData(fetchedData);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
    setLoading(false);
  };
  const handleSearchByKeyword = async (searchParams = {}) => {
    setLoading(true);
    try {
      const fetchedData = await getNovelsByKeyword(
        searchParams.keyword,
        searchParams.status,
        searchParams.title,
        searchParams.selectedWords
      );
      if (fetchedData.length == 0) {
        message.info("小朋友，没有这个内容😟😟😟");
        return;
      }
      setData(fetchedData);
    } catch (error) {
      console.error("Failed to fetch novels by keyword:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    handleSearch();
  }, []);

  const handleCollapseChange = (isCollapsed) => {
    setFilterHeight(isCollapsed ? "50px" : "120px"); // 根据实际内容调整这些值
  };
  const handlesetKeyword = (obj) => {
    setKeyword(obj.keyword);
  };
  return (
    <div>
      <div
        style={{
          minHeight: filterHeight,
          backgroundColor: "white",
          borderRadius: "6px",
          transition: "min-height 0.3s ease-in-out",
        }}
      >
        <Filter
          onSearch={handleSearchByKeyword}
          onCollapseChange={handleCollapseChange}
          onSetKeyword={handlesetKeyword}
        />
      </div>
      {loading ? (
        <Spin /> // 如果 loading 是 true，展示 Spin 组件
      ) : (
        <Table data={data} keyword={keyword} /> // 否则，展示 Table 组件
      )}
    </div>
  );
};

export default IndexPage;
