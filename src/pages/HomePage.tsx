import React, { useState, useEffect, useRef } from "react";
import { Column } from "@ant-design/plots";
import { Bar } from "@ant-design/plots";
import { Col, Row } from "antd";
import { io } from "socket.io-client";

const HomePage = () => {
  const socket = useRef<any>();

  useEffect(() => {
    socket.current = io("http://localhost:8888");
  }, []);

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);

  useEffect(() => {
    asyncFetch1();
    asyncFetch2();
    asyncFetch3();
  }, []);

  const asyncFetch1 = () => {
    fetch("http://localhost:9000/questions/24")
      .then((response) => response.json())
      .then((json) => setData1(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };

  const newData1 = data1.map((item: any) => ({
    ...item,
    fullName: `${item.firstName}${item.lastName}`,
  }));

  const config1 = {
    data: newData1,
    xField: "fullName",
    yField: "total_sales",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      fullName: {
        alias: "姓名",
      },
      sales: {
        alias: "销售额",
      },
    },
  };

  const asyncFetch2 = () => {
    fetch("http://localhost:9000/questions/18")
      .then((response) => response.json())
      .then((json) => setData2(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  const config2 = {
    data: data2,
    xField: "numberOfProducts",
    yField: "name",
    seriesField: "name",
    // legend: {
    //   position: "left",
    // },
  };

  const asyncFetch3 = () => {
    fetch("http://localhost:9000/questions/19")
      .then((response) => response.json())
      .then((json) => setData3(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  const config3 = {
    data: data3,
    xField: "numberOfProducts",
    yField: "name",
    seriesField: "name",
    // legend: {
    //   position: "left",
    // },
  };
  return (
    <div style={{ overflowY: "auto", height: "auto", width: "auto" }}>
      <Row>
        <Col span={24}>
          <h4> Best employee's total sales</h4>
          <Column {...config1} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {" "}
          <h4>Number of goods in each category</h4>
          <Bar {...config2} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {" "}
          <h4>Number of goods in each supplier</h4>
          <Bar {...config3} />
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
