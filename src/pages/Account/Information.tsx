import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  Popconfirm,
  Row,
  Typography,
  Upload,
  message,
} from "antd";
import {
  EditFilled,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";

type Props = {};
const { Panel } = Collapse;
const { Text } = Typography;

//Component

const Information = (props: Props) => {
  const [refresh, setRefresh] = useState(0);
  const [user, setUser] = useState<any>();

  const [selectItem, setSelectItem] = useState("0");
  const [updateData, setUpdateData] = useState<any>();
  const onChange = (key: string | string[]) => {
    console.log(key);
  };
  const { auth } = useAuthStore((state: any) => state);

  const URL_ENV = process.env.REACT_APP_BASE_URL || "http://localhost:9000";
  const E_URL = `${URL_ENV}/employees/${auth.payload._id}`;

  useEffect(() => {
    axios
      .get(E_URL)
      .then((res) => {
        setUser(res.data.result);
      })
      .catch((err) => console.log(err));
  }, [E_URL, refresh]);

  const [updateForm] = Form.useForm();

  const handleUpdate = (record: any) => {
    const confirmData = { [selectItem]: updateData[selectItem] };
    updateForm.resetFields();
    axios
      .patch(`${URL_ENV}/employees/${auth.payload._id}`, confirmData)
      .then((res) => {
        setRefresh((f) => f + 1);
        message.success("Update a data successFully!!", 1.5);
      })
      .catch((err) => console.log(err));
  };

  //TAB PROFILE SETTING
  const tabListNoTitle = [
    {
      key: "setting",
      tab: "Profile setting",
    },
  ];
  const contentListNoTitle: Record<string, React.ReactNode> = {
    setting: (
      <Form form={updateForm} name="updateForm" onFinish={setUpdateData}>
        <div>
          <Collapse accordion onChange={onChange}>
            <Panel header="First Name" key="1">
              <Form.Item name="firstName" noStyle>
                <Input
                  style={{ width: 160 }}
                  placeholder={`(${user?.firstName})`}
                />
              </Form.Item>
              <Popconfirm
                title="Edit profile"
                description="Are you sure to edit this Fisrt Name?"
                okText="Yes"
                cancelText="No"
                onConfirm={handleUpdate}
              >
                <Button
                  style={{ width: "30px", right: "-4px" }}
                  type="primary"
                  htmlType="submit"
                  icon={<EditFilled />}
                  onClick={() => {
                    setSelectItem("firstName");
                  }}
                />
              </Popconfirm>
            </Panel>
            <Panel header="Last Name" key="2">
              <Form.Item name="lastName" noStyle>
                <Input
                  style={{ width: 160 }}
                  placeholder={`(${user?.lastName})`}
                />
              </Form.Item>
              <Popconfirm
                title="Edit profile"
                description="Are you sure to edit this Last Name?"
                okText="Yes"
                cancelText="No"
                onConfirm={handleUpdate}
              >
                <Button
                  style={{ width: "30px", right: "-4px" }}
                  type="primary"
                  htmlType="submit"
                  icon={<EditFilled />}
                  onClick={() => {
                    setSelectItem("lastName");
                  }}
                />
              </Popconfirm>
            </Panel>
            <Panel header="Address" key="3">
              <Form.Item name="address" noStyle>
                <Input
                  style={{ width: 160 }}
                  placeholder={`(${user?.address})`}
                />
              </Form.Item>
              <Popconfirm
                title="Edit profile"
                description="Are you sure to edit this Address?"
                okText="Yes"
                cancelText="No"
                onConfirm={handleUpdate}
              >
                <Button
                  style={{ width: "30px", right: "-4px" }}
                  type="primary"
                  htmlType="submit"
                  icon={<EditFilled />}
                  onClick={() => {
                    setSelectItem("address");
                  }}
                />
              </Popconfirm>
            </Panel>
            <Panel header="Phone Number" key="4">
              <Form.Item name="phoneNumber" noStyle>
                <Input
                  style={{ width: 160 }}
                  placeholder={`(${user?.phoneNumber})`}
                />
              </Form.Item>
              <Popconfirm
                title="Edit profile"
                description="Are you sure to edit this Phone Number?"
                okText="Yes"
                cancelText="No"
                onConfirm={handleUpdate}
              >
                <Button
                  style={{ width: "30px", right: "-4px" }}
                  type="primary"
                  htmlType="submit"
                  icon={<EditFilled />}
                  onClick={() => {
                    setSelectItem("phoneNumber");
                  }}
                />
              </Popconfirm>
            </Panel>
            <Panel header="User Name (Email)" key="5">
              <Form.Item name="email" noStyle>
                <Input
                  style={{ width: 160 }}
                  placeholder={`(${user?.email})`}
                />
              </Form.Item>
              <Popconfirm
                title="Edit profile"
                description="Are you sure to edit this User Name (Email)?"
                okText="Yes"
                cancelText="No"
                onConfirm={handleUpdate}
              >
                <Button
                  style={{ width: "30px", right: "-4px" }}
                  type="primary"
                  htmlType="submit"
                  icon={<EditFilled />}
                  onClick={() => {
                    setSelectItem("email");
                  }}
                />
              </Popconfirm>
            </Panel>
          </Collapse>
        </div>
      </Form>
    ),
  };

  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        {!user ? (
          <Card loading={true}></Card>
        ) : (
          <Row className="py-3 ">
            <Col xs={24} xl={5}>
              <Card bordered={false} style={{ width: "90%" }}>
                <div className="text-center">
                  <div>
                    <Avatar size={64} icon={<UserOutlined />} />
                  </div>
                  <Upload
                    showUploadList={false}
                    name="file"
                    action={`${URL_ENV}/upload/employees/${auth.payload._id}/image`}
                    headers={{ authorization: "authorization-text" }}
                    onChange={(info) => {
                      if (info.file.status !== "uploading") {
                        console.log(info.file);
                      }

                      if (info.file.status === "done") {
                        message.success(
                          `${info.file.name} file uploaded successfully`
                        );

                        setTimeout(() => {
                          console.log("««««« run »»»»»");
                          setRefresh(refresh + 1);
                        }, 1000);
                      } else if (info.file.status === "error") {
                        message.error(`${info.file.name} file upload failed.`);
                      }
                    }}
                  >
                    <Button icon={<UploadOutlined />} />
                  </Upload>
                  <p className="py-2">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div className="text-left">
                  {" "}
                  <p>
                    <MailOutlined /> <Text className="px-2">{user.email}</Text>
                  </p>
                  <p>
                    <PhoneOutlined />{" "}
                    <Text className="px-2">{user.phoneNumber}</Text>
                  </p>
                  <p>
                    <HomeOutlined />{" "}
                    <Text className="px-2">{user.address}</Text>
                  </p>
                </div>

                <Divider>More Information</Divider>
              </Card>
            </Col>
            <Col xs={24} xl={14}>
              <Card
                style={{ width: "90%" }}
                tabList={tabListNoTitle}
                activeTabKey={"setting"}
              >
                {contentListNoTitle["setting"]}
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default Information;
