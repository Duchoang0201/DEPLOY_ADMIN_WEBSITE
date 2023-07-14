import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Button, Card, Col, Divider, Row, Space, Statistic } from "antd";
import {
  AppstoreOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { axiosClient } from "../../libraries/axiosClient";
type Props = {};
const YearInformation = (props: Props) => {
  const URL_ENV = process.env.REACT_APP_BASE_URL || "http://localhost:9000";

  const formatter = (value: any) => <CountUp end={value} separator="," />;

  const [orderTotal, setOrderTotal] = useState<any>();
  const [totalUser, setTotalUser] = useState<any>();
  const [listOrders, setListOrders] = useState<any>();
  const [productsActive, setProductsActive] = useState<any>();
  useEffect(() => {
    axios.get(`${URL_ENV}/questions/23`).then((res) => {
      setOrderTotal(res.data);
    });
    axios.get(`${URL_ENV}/customers`).then((res) => {
      setTotalUser(res.data.amountResults);
    });

    axios.get(`${URL_ENV}/products?active=true`).then((res) => {
      setProductsActive(res.data.amountResults);
    });
  }, [URL_ENV]);

  useEffect(() => {
    axiosClient.get(`/orders`).then((res: any) => {
      setListOrders(res.data.amountResults);
    });
  }, []);
  return (
    <div>
      {" "}
      <Divider orientation="left">Year's Information</Divider>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col xs={24} xl={6}>
          {" "}
          <Card bordered={false} style={{ width: "100%" }}>
            <div className="d-flex justify-content-between">
              <div className="content">
                {" "}
                <Space>
                  <Statistic
                    prefix={`VNĐ`}
                    title="Year's Sale"
                    value={orderTotal?.total}
                    formatter={formatter}
                    style={{ fontWeight: "bold" }}
                  />{" "}
                </Space>
              </div>
              <Button
                icon={
                  <DollarOutlined
                    style={{ fontSize: "24px", color: "white" }}
                  />
                }
                style={{ height: 60, width: 60, backgroundColor: "#1890ff" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={6}>
          {" "}
          <Card bordered={false} style={{ width: "100%" }}>
            <div className="d-flex justify-content-between">
              <div className="content">
                {" "}
                <Space>
                  <Statistic
                    title="Order's total"
                    value={listOrders}
                    formatter={formatter}
                    style={{ fontWeight: "bold" }}
                  />{" "}
                </Space>
              </div>
              <Button
                icon={
                  <ShoppingCartOutlined
                    style={{ fontSize: "24px", color: "white" }}
                  />
                }
                style={{ height: 60, width: 60, backgroundColor: "#1890ff" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={6}>
          {" "}
          <Card bordered={false} style={{ width: "100%" }}>
            <div className="d-flex justify-content-between">
              <div className="content">
                {" "}
                <Space>
                  <Statistic
                    title="Customer's total"
                    value={totalUser}
                    formatter={formatter}
                    style={{ fontWeight: "bold" }}
                  />{" "}
                </Space>
              </div>
              <Button
                icon={
                  <UserOutlined style={{ fontSize: "24px", color: "white" }} />
                }
                style={{ height: 60, width: 60, backgroundColor: "#1890ff" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={6}>
          {" "}
          <Card bordered={false} style={{ width: "100%" }}>
            <div className="d-flex justify-content-between">
              <div className="content">
                {" "}
                <Space>
                  <Statistic
                    title="Product's active"
                    value={productsActive}
                    formatter={formatter}
                    style={{ fontWeight: "bold" }}
                  />{" "}
                </Space>
              </div>
              <Button
                icon={
                  <AppstoreOutlined
                    style={{ fontSize: "24px", color: "white" }}
                  />
                }
                style={{ height: 60, width: 60, backgroundColor: "#1890ff" }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default YearInformation;
