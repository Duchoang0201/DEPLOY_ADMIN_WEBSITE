import React, { useEffect, useState } from "react";
import { Card, Col, Divider, Row } from "antd";
import axios from "axios";
import { Pie } from "@ant-design/plots";
type Props = {};
const Numberofgoods = (props: Props) => {
  const URL_ENV = process.env.REACT_APP_BASE_URL || "http://localhost:9000";

  const [totalCategory, setTotalCategory] = useState<any>();
  const [totalSupplier, setTotalSupplier] = useState<any>();
  useEffect(() => {
    axios.get(`${URL_ENV}/questions/18`).then((res) => {
      setTotalCategory(res.data);
    });
    axios.get(`${URL_ENV}/questions/19`).then((res) => {
      setTotalSupplier(res.data);
    });
  }, [URL_ENV]);
  let data: any = [];
  if (totalCategory && totalCategory.length) {
    data = totalCategory.map((item: any) => ({
      numberOfProducts: item.numberOfProducts,
      name: `${item.name}`,
    }));
  }

  const config = {
    appendPadding: 10,
    data: data,
    angleField: "numberOfProducts",
    colorField: "name",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
        fontColor: "red",
      },
    },

    statistic: {
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      },
    },
  };

  let data2: any[] = [];
  if (totalSupplier && totalSupplier.length) {
    data2 = totalSupplier.map((item: any) => ({
      numberOfProducts: item.numberOfProducts,
      name: `${item.name}`,
    }));
  }

  const config2 = {
    appendPadding: 10,
    data: data2,
    angleField: "numberOfProducts",
    colorField: "name",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
        fontColor: "red",
      },
    },

    statistic: {
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      },
    },
  };

  return (
    <div>
      <Divider orientation="left">Number of gooods</Divider>
      <Card>
        <Row className="px-1">
          <Col xs={24} xl={12}>
            <Card
              type="inner"
              title={"Số lượng hàng hóa trên mỗi danh mục"}
              bordered={false}
            >
              <Pie {...config} />
            </Card>{" "}
          </Col>
          <Col xs={24} xl={12}>
            <Card
              type="inner"
              title={"Số lượng hàng hóa trên mỗi nhà cung cấp"}
            >
              <Pie {...config2} />
            </Card>{" "}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Numberofgoods;
