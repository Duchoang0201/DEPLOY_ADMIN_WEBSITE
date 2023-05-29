import React, { useEffect, useState } from "react";
import { Card, Col, Divider, Row } from "antd";
import axios from "axios";
import { Bar, Column } from "@ant-design/plots";
type Props = {};
const GeneralInformation = (props: Props) => {
  const URL_ENV = process.env.REACT_APP_BASE_URL || "http://localhost:9000";

  const [totalMonth, setTotalMonth] = useState<any>();
  const [lineData, setLineData] = useState<any>();
  useEffect(() => {
    axios.get(`${URL_ENV}/questions/23b`).then((res) => {
      setTotalMonth(res.data);
    });
    axios.get(`${URL_ENV}/questions/27b`).then((res) => {
      setLineData(res.data);
    });
  }, [URL_ENV]);
  let data: any = [];
  if (totalMonth && totalMonth.length) {
    data = totalMonth.map((item: any) => ({
      month: `${item.month}`,
      revenue: item.revenue,
    }));
  }

  const config = {
    data: data,
    xField: "month",
    yField: "revenue",
    seriesField: "month",
    color: `white`,

    tooltip: {
      customContent: (title: any, items: any) => {
        const formattedItems = items.map((item: any) => {
          const formattedValue = item.value
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          let name = item.name;
          if (name) {
            name = name.split(":")[1]?.trim(); // Extract the text after the colon and remove leading/trailing spaces
          }
          return ` ${formattedValue}`;
        });
        return `<div> Tháng ${title} :</div><div>${formattedItems.join(
          "<br/>"
        )} VND</div>`;
      },
    },
    xAxis: {
      title: {
        text: "Tháng",
        style: {
          fill: "white",
        },
      },
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fill: "white",
          line: [4, 4],
        },
      },
      grid: {
        line: {
          style: {
            stroke: "#ddd",
            lineDash: [4, 4],
          },
        },
        alternateColor: "rgba(0,0,0,0.05)",
      },
    },
    yAxis: {
      title: {
        text: "Doanh thu ",
        style: {
          fill: "white",
        },
      },
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fill: "white", // Change the color of yField label to blue
        },
        formatter: (value: any) => {
          const formattedPrice = value
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          const data = `${formattedPrice}đ`;
          return data;
        },
      },
      grid: {
        line: {
          style: {
            stroke: "#ddd",
            lineDash: [4, 4],
          },
        },
        alternateColor: "rgba(0,0,0,0.05)",
      },
    },
    columnStyle: {
      radius: [5, 5, 5, 5],
    },
  };

  let data2: any[] = [];
  if (lineData && lineData.length) {
    data2 = lineData.map((item: any) => ({
      name: `${item.firstName} ${item.lastName} `,
      revenue: item.total,
      month: item.month,
    }));
  }

  const config2 = {
    data: data2,
    xField: "revenue",
    yField: "name",
    color: "white",
    xAxis: {
      title: {
        text: "Doanh thu",
        style: {
          fill: "white",
        },
      },
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fill: "white", // Change the color of xField label to red
          line: [4, 4], // This creates a dashed line effect
        },
        formatter: (value: any) => {
          const formattedPrice = value
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          const data = `${formattedPrice}đ`;
          return data;
        },
      },
      grid: {
        line: {
          style: {
            stroke: "#ddd",
            lineDash: [4, 2],
          },
        },
        alternateColor: "rgba(0,0,0,0.05)",
      },
    },
    tooltip: {
      customContent: (title: any, items: any) => {
        const formattedItems = items.map((item: any) => {
          const formattedValue = item.value
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          let name = item.name;
          if (name) {
            name = name.split(":")[1]?.trim(); // Extract the text after the colon and remove leading/trailing spaces
          }
          return ` ${formattedValue}`;
        });
        return `<div> Tháng ${title} :</div><div>${formattedItems.join(
          "<br/>"
        )} VND</div>`;
      },
    },
    yAxis: {
      title: {
        text: " Nhân viên",
        style: {
          fill: "white",
        },
      },
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fill: "white", // Change the color of yField label to blue
        },
      },
      grid: {
        line: {
          style: {
            stroke: "#ddd",
            lineDash: [4, 4],
          },
        },
        alternateColor: "rgba(0,0,0,0.05)",
      },
    },
    columnStyle: {
      radius: [10, 10, 10, 10],
    },
  };

  return (
    <div>
      <Divider orientation="left">Genaral Information</Divider>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col xs={24} xl={10}>
          <Card title={"Doanh thu trong năm"} bordered={false}>
            <div
              className=" px-3 py-3 rounded-4"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#00369e,#005cfd,#a18dff)",
              }}
            >
              <Column className="rounded-4" {...config} />
            </div>
          </Card>{" "}
        </Col>
        <Col xs={24} xl={14}>
          {" "}
          <Card
            title={`Top nhân viên bán hàng xuất sắc trong năm`}
            bordered={false}
            // style={{ width: "100%" }}
          >
            <div
              className="px-3 py-3"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#435a65,#487d4c,#758831)",
              }}
            >
              <Bar {...config2} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralInformation;
