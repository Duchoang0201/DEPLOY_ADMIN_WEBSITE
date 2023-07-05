import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Input,
  Row,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import axios from "axios";
import {
  EditOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../hooks/useAuthStore";

type Props = {};
const { Text } = Typography;
const Information = (props: Props) => {
  const URL_ENV = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:9000";

  const [refresh, setRefresh] = useState(0);
  const { auth } = useAuthStore((state: any) => state);

  const [user, setUser] = useState<any>();

  const [disabled, setDisabled] = useState(true);
  const [disabledNewPassword, setDisabledNewPassword] = useState(true);

  const [loading, setLoading] = useState<any>(true);

  //SetPassword:
  const [oldPassWord, setOldPassWord] = useState("");
  const [newPassword, setNewPassword] = useState("");

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  const E_URL = `${URL_ENV}/employees/${auth?.payload._id}`;

  useEffect(() => {
    axios
      .get(E_URL)
      .then((res) => {
        setUser(res.data.result);
      })
      .catch((err) => console.log(err));
  }, [E_URL, refresh]);

  return (
    <>
      <Row
        className="px-2 py-2  bg-body-secondary rounded-5 d-flex justify-content-evenly"
        style={{ backgroundColor: "white" }}
      >
        <Col xs={24} xl={7}>
          <Card loading={loading} bordered={true} style={{ width: "100%" }}>
            <div className="text-center">
              <Avatar
                shape="square"
                // size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                size={100}
                src={`${URL_ENV}${user?.imageUrl}`}
              />
              <div className="py-2">
                <Upload
                  showUploadList={false}
                  name="file"
                  action={`${URL_ENV}/upload/employees/${auth?.payload._id}/image`}
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
              </div>
              <p className="py-2">
                {user?.firstName} {user?.lastName}
              </p>
            </div>

            <div className="text-left">
              {" "}
              <p>
                <MailOutlined /> <Text className="px-2">{user?.email}</Text>
              </p>
              <p>
                <PhoneOutlined />{" "}
                <Text className="px-2">{user?.phoneNumber}</Text>
              </p>
              <p>
                <HomeOutlined /> <Text className="px-2">{user?.address}</Text>
              </p>
            </div>

            <Divider>More Information</Divider>
          </Card>
        </Col>
        <Col xs={24} xl={14} title="Cài đặt tài khoản">
          <Card loading={loading} bordered={true}>
            <div>
              <Collapse accordion>
                <Collapse.Panel header="First Name" key="1">
                  <Row gutter={10} className="py-2">
                    <Col span={20}>
                      <Input.Search
                        disabled={disabled}
                        enterButton={<SendOutlined />}
                        placeholder={auth?.payload?.firstName}
                        style={{ width: "100%" }}
                        onSearch={async (e) => {
                          axios
                            .patch(`${URL_ENV}/employees/${auth.payload._id}`, {
                              firstName: e,
                            })
                            .then((res) => {
                              const count = setTimeout(() => {
                                message.success(
                                  `Change fisrt name to ${res.data.firstName} successfully!!`,
                                  1.5
                                );
                                setRefresh((f) => f + 1);
                                setDisabled(!disabled);
                              }, 2000);
                            })
                            .catch((err) => console.log(err));
                          message.loading("Changing First Name !!", 1.5);
                        }}
                      />
                    </Col>

                    <Col span={4}>
                      <Button
                        danger={!disabled}
                        type="dashed"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setDisabled(!disabled);
                        }}
                      />
                    </Col>
                  </Row>
                </Collapse.Panel>
                <Collapse.Panel header="Last Name" key="2">
                  <Row gutter={10} className="py-2">
                    <Col span={20}>
                      <Input.Search
                        disabled={disabled}
                        enterButton={<SendOutlined />}
                        placeholder={auth?.payload?.lastName}
                        style={{ width: "100%" }}
                        onSearch={async (e) => {
                          axios
                            .patch(`${URL_ENV}/employees/${auth.payload._id}`, {
                              lastName: e,
                            })
                            .then((res) => {
                              const count = setTimeout(() => {
                                message.success(
                                  `Change last name to ${res.data.lastName} successfully!!`,
                                  1.5
                                );
                                setRefresh((f) => f + 1);
                                setDisabled(!disabled);
                              }, 2000);
                            })
                            .catch((err) => console.log(err));
                          message.loading("Changing Last Name !!", 1.5);
                        }}
                      />
                    </Col>

                    <Col span={4}>
                      <Button
                        danger={!disabled}
                        type="dashed"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setDisabled(!disabled);
                        }}
                      />
                    </Col>
                  </Row>
                </Collapse.Panel>
                <Collapse.Panel header="Address" key="3">
                  <Row gutter={10} className="py-2">
                    <Col span={20}>
                      <Input.Search
                        disabled={disabled}
                        enterButton={<SendOutlined />}
                        placeholder={auth?.payload?.address}
                        style={{ width: "100%" }}
                        onSearch={async (e) => {
                          axios
                            .patch(`${URL_ENV}/employees/${auth.payload._id}`, {
                              address: e,
                            })
                            .then((res) => {
                              const count = setTimeout(() => {
                                message.success(
                                  `Change address to ${res.data.address} successfully!!`,
                                  1.5
                                );
                                setRefresh((f) => f + 1);
                                setDisabled(!disabled);
                              }, 2000);
                            })
                            .catch((err) => console.log(err));
                          message.loading("Changing address !!", 1.5);
                        }}
                      />
                    </Col>

                    <Col span={4}>
                      <Button
                        danger={!disabled}
                        type="dashed"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setDisabled(!disabled);
                        }}
                      />
                    </Col>
                  </Row>
                </Collapse.Panel>
                <Collapse.Panel header="Phone Number" key="4">
                  <Row gutter={10} className="py-2">
                    <Col span={20}>
                      <Input.Search
                        disabled={disabled}
                        enterButton={<SendOutlined />}
                        placeholder={auth?.payload?.phoneNumber}
                        style={{ width: "100%" }}
                        onSearch={async (e) => {
                          axios
                            .patch(`${URL_ENV}/employees/${auth.payload._id}`, {
                              phoneNumber: e,
                            })
                            .then((res) => {
                              message.loading("Changing Phone Number !!", 1.5);

                              console.log("««««« res »»»»»", res);
                              const count = setTimeout(() => {
                                message.success(
                                  `Change Phone Number to ${res.data.result.phoneNumber} successfully!!`,
                                  1.5
                                );
                                setRefresh((f) => f + 1);
                                setDisabled(!disabled);
                              }, 2000);
                            })
                            .catch((err) => {
                              console.log(err);
                              message.error(`${err.response.data.message}`);
                            });
                        }}
                      />
                    </Col>

                    <Col span={4}>
                      <Button
                        danger={!disabled}
                        type="dashed"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setDisabled(!disabled);
                        }}
                      />
                    </Col>
                  </Row>
                </Collapse.Panel>
                <Collapse.Panel header="User Name (Email)" key="5">
                  <Row gutter={10} className="py-2">
                    <Col span={20}>
                      <Input.Search
                        disabled={disabled}
                        enterButton={<SendOutlined />}
                        placeholder={auth?.payload?.email}
                        style={{ width: "100%" }}
                        onSearch={async (e) => {
                          axios
                            .patch(`${URL_ENV}/employees/${auth.payload._id}`, {
                              email: e,
                            })
                            .then((res) => {
                              message.loading("Changing Email !!", 1.5);

                              const count = setTimeout(() => {
                                message.success(
                                  `Change email to ${res.data.result.email} successfully!!`,
                                  1.5
                                );
                                setRefresh((f) => f + 1);
                                setDisabled(!disabled);
                              }, 2000);
                            })
                            .catch((err) => {
                              console.log(err);
                              message.error(`${err.response.data.message}`);
                            });
                        }}
                      />
                    </Col>

                    <Col span={4}>
                      <Button
                        danger={!disabled}
                        type="dashed"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setDisabled(!disabled);
                        }}
                      />
                    </Col>
                  </Row>
                </Collapse.Panel>
                <Collapse.Panel header="Password" key="6">
                  {" "}
                  <div>
                    Đổi mật khẩu{" "}
                    <Button
                      danger={!disabled}
                      type="dashed"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setDisabled(!disabled);
                      }}
                    />{" "}
                    <Row gutter={10} className="py-2">
                      <Col span={20}>
                        <Space>
                          <Input.Password
                            disabled={disabled}
                            value={oldPassWord}
                            placeholder={`********`}
                            style={{ width: "100%" }}
                            onChange={(e) => setOldPassWord(e.target.value)}
                          />
                          <Button
                            disabled={disabled}
                            onClick={async (e) => {
                              axios
                                .post(`${URL_ENV}/employees/login`, {
                                  email: auth.payload.email,
                                  password: oldPassWord,
                                })
                                .then((res) => {
                                  if (res.data.token) {
                                    message.success(
                                      "Confirmed pre password sucessfully !!, Please enter New PassWord",
                                      1.5
                                    );
                                    setOldPassWord("");

                                    const count = setTimeout(() => {
                                      setDisabled(!disabled);
                                      setDisabledNewPassword(false);
                                    }, 2000);
                                  }
                                })
                                .catch((err) => {
                                  console.log(err);
                                  message.error(
                                    `${err?.response?.data?.message}`
                                  );
                                });
                            }}
                            icon={<SendOutlined />}
                          />
                        </Space>
                      </Col>
                    </Row>
                  </div>
                  <div className="">
                    <Row gutter={10} className="py-2">
                      Mật khẩu mới:
                      <Col span={20}>
                        <Space>
                          <Input.Password
                            disabled={disabledNewPassword}
                            placeholder={`********`}
                            value={newPassword}
                            style={{ width: "100%" }}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                            }}
                          />
                          <Button
                            disabled={disabledNewPassword}
                            onClick={async (e: any) => {
                              axios
                                .patch(
                                  `${URL_ENV}/employees/${auth.payload._id}`,
                                  {
                                    password: newPassword,
                                  }
                                )
                                .then((res) => {
                                  message.loading("Changing Password !!", 1.5);

                                  const count = setTimeout(() => {
                                    message.success(
                                      `Change Password  successfully!!`,
                                      1.5
                                    );
                                    setNewPassword("");
                                    setRefresh((f) => f + 1);
                                    setDisabled(true);
                                    setDisabledNewPassword(
                                      !disabledNewPassword
                                    );
                                  }, 2000);
                                })
                                .catch((err) => {
                                  console.log(err);
                                  message.error(
                                    `${err?.response?.data?.message}`
                                  );
                                });
                            }}
                            icon={<SendOutlined />}
                          />
                        </Space>
                      </Col>
                    </Row>
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Information;
