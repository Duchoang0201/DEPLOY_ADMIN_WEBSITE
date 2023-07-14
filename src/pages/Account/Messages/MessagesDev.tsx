import { Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import { useAuthStore } from "../../../hooks/useAuthStore";
import UserList from "../UserList/UserList";
import Header from "./Header/Header";
import Body from "./Body/Body";
import Form from "./Form/Form";

const MessagesDev = (collapsed: any) => {
  const [conversations, setConversations] = useState([]);
  const { auth } = useAuthStore((state: any) => state);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axiosClient.post(
          `/conversations/${auth.payload._id}`
        );
        setConversations(res.data);
      } catch (err) {}
    };
    getConversations();
  }, [auth.payload._id]);

  return (
    <Row
      className="px-2 py-2  bg-body-secondary rounded-5 d-flex justify-content-evenly"
      style={{ backgroundColor: "white" }}
    >
      <Col xs={24} xl={6}>
        <Card bordered={true} style={{ width: "100%" }}>
          <UserList items={conversations} />
        </Card>
      </Col>
      <Col xs={24} xl={18} title="Box chat">
        <Card bordered={true}>
          <Header
            conversation={{
              users: undefined,
            }}
          />
          <Body />
          <Form />
        </Card>
      </Col>
    </Row>
  );
};

export default MessagesDev;
