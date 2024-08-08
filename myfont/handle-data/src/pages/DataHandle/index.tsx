import React from "react";
import { Row, Col,Spin, Card, Space, Tooltip, Button, Popover, message  } from "antd";
import getMyData from "../../api/Data/getMyData";

const getData = async () => {
    try {
        const response = await getMyData();
        if (response) {
            console.log(response);
            message.success("内容已成功概括🎉🎉🎉");
        } else {
            message.error("没有返回数据");
        }
    } catch (error) {
        message.error("内容概括失败");
        console.error("概括失败：", error);
    }
}

const DataHandle = () => {
    return (
        <h1>
            <Button type="primary" onClick={getData}>得到数据</Button>
        </h1>
    );
};

export default DataHandle;
