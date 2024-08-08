import React, { useState, useEffect } from "react";
import { Row, Col, Spin, Card, Space, Tooltip, Button, message } from "antd";
import { GetRelatedContent } from "../../../api/GetRelatedContent";
import { Link } from "react-router-dom"; // 导入 Link 组件
const RelatedContent = ({ relatedIds }) => {
  const [books, setBooks] = useState([]);
  const fetchBooks = async (relatedIds) => {
    try {
      const res = await GetRelatedContent(relatedIds);
      if (res.length === 0) {
        message.error("没有找到相关书籍");
      } else {
        setBooks(res);
      }
    } catch (error) {
      message.error("没有找到相关书籍");
    }
  };
  useEffect(() => {
    fetchBooks(relatedIds);
  }, [relatedIds]);
  return (
    <div>
      <Card className="cardShadow" title="相关推荐" style={{ width: "100%" }}>
        <div
          className="contentStyle"
          style={{
            maxHeight: "800px",
            overflowY: "auto",
            // textIndent: "2em",
            padding: "10px",
          }}
        >
          {books.map((book) => {
            return (
              <div className="recommend_divClass" key={book.id}>
                <Link to={`/table/book/${book.id}`}>
                  <div className="recommend_container" data-text={book.title}>
                    <img src="../../../src/static/book.jpg" alt="图片" />
                  </div>
                  <div>
                    <div className="text">{book.title}</div>
                    <div className="author">{book.author}</div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
export default RelatedContent;
