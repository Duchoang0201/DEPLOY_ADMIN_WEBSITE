import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import { Avatar, Card, Col, Collapse, Divider, Row, Typography } from "antd";
import {
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";

type Props = {};
const { Panel } = Collapse;
const { Text } = Typography;
const tabListNoTitle = [
  {
    key: "article",
    tab: "article",
  },
  {
    key: "app",
    tab: "app",
  },
  {
    key: "setting",
    tab: "Setting",
  },
];
const onChange = (key: string | string[]) => {
  console.log(key);
};
const contentListNoTitle: Record<string, React.ReactNode> = {
  article: <p>article content</p>,
  app: <p>app content</p>,
  setting: (
    <p>
      <Collapse defaultActiveKey={["1"]} onChange={onChange}>
        <Panel header="This is panel header 1" key="1">
          <p>a</p>
        </Panel>
        <Panel header="This is panel header 2" key="2">
          <p></p>
        </Panel>
        <Panel header="This is panel header 3" key="3">
          <p></p>
        </Panel>
      </Collapse>
    </p>
  ),
};

//Component

const Information = (props: Props) => {
  const { auth } = useAuthStore((state: any) => state);

  const [activeTabKey, setActiveTabKey] = useState<string>("app");
  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const E_URL = `http://localhost:9000/employees?employeeId=${auth.payload._id}`;
  useEffect(() => {
    axios.get(E_URL);
  }, []);
  return (
    <>
      {!auth ? (
        <Card style={{ width: 300, marginTop: 16 }} loading={true}></Card>
      ) : (
        <Row>
          <Col span={18} push={5}>
            <Card
              style={{ width: "100%" }}
              tabList={tabListNoTitle}
              activeTabKey={activeTabKey}
              onTabChange={onTabChange}
            >
              {contentListNoTitle[activeTabKey]}
            </Card>
          </Col>
          <Col span={6} pull={18}>
            <Card bordered={false} style={{ width: 300 }}>
              <div className="text-center">
                <Avatar size={64} icon={<UserOutlined />} />
                <p className="py-2">
                  {auth?.payload.firstName} {auth?.payload.lastName}
                </p>
              </div>
              <div className="text-left">
                {" "}
                <p>
                  <MailOutlined />{" "}
                  <Text className="px-2">{auth?.payload.email}</Text>
                </p>
                <p>
                  <PhoneOutlined />{" "}
                  <Text className="px-2">{auth?.payload.phoneNumber}</Text>
                </p>
                <p>
                  <HomeOutlined />{" "}
                  <Text className="px-2">{auth?.payload.address}</Text>
                </p>
              </div>

              <Divider>More Information</Divider>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Information;
