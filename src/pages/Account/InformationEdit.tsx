import React, { useEffect, useState } from "react";
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
import axios from "axios";
import {
  EditFilled,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../hooks/useAuthStore";

type Props = {};
const { Text } = Typography;
const AccountInformation = (props: Props) => {
  const URL_ENV = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:9000";

  const [refresh, setRefresh] = useState(0);
  const { auth } = useAuthStore((state: any) => state);

  const [user, setUser] = useState<any>();

  const [selectItem, setSelectItem] = useState<any>();
  const [updateData, setUpdateData] = useState<any>();
  const [updateForm] = Form.useForm();

  const [loading, setLoading] = useState<any>(true);
  setTimeout(() => {
    setLoading(false);
  }, 1000);

  const E_URL = `${URL_ENV}/customers/${auth?.payload._id}`;

  useEffect(() => {
    axios
      .get(E_URL)
      .then((res) => {
        setUser(res.data.result);
      })
      .catch((err) => console.log(err));
  }, [E_URL, refresh]);

  const handleUpdate = (record: any) => {
    const confirmData = { [selectItem]: updateData[selectItem] };

    if (updateData) {
      if (selectItem === "password") {
        axios
          .post(`${URL_ENV}/customers/login`, {
            email: user.email,
            password: updateData["checkPassword"],
          })
          .then(() => {
            axios
              .patch(`${URL_ENV}/customers/${auth.payload._id}`, {
                password: updateData["newPassword"],
              })
              .then((res) => {
                console.log(res);
                setRefresh((f) => f + 1);
                updateForm.resetFields();
                message.success(`Update ${selectItem} successFully!!`, 1.5);
              })
              .catch((err) => {
                message.error(`Cập nhật không thành công`, 1.5);
              });
          })
          .catch((err: any) => {
            message.error(
              `Mật khẩu hiện tại không đúng, vui lòng thử lại!! ${err?.response?.data?.message}`,
              1.5
            );
          });
      } else {
        axios
          .patch(`${URL_ENV}/customers/${auth.payload._id}`, confirmData)
          .then((res) => {
            console.log(res);
            setRefresh((f) => f + 1);
            updateForm.resetFields();

            message.success("Update a data successFully!!", 1.5);
          })
          .catch((err) => console.log(err));
      }
    } else {
      message.error(`Vui lòng nhập ${selectItem} để sửa đổi`, 1.5);
    }
  };
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
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                src={`${URL_ENV}${user?.imageUrl}`}
              />
              <div className="py-2">
                <Upload
                  showUploadList={false}
                  name="file"
                  action={`${URL_ENV}/upload/customers/${auth?.payload._id}/image`}
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
            <Form form={updateForm} name="updateForm" onFinish={setUpdateData}>
              <div>
                <Collapse accordion>
                  <Collapse.Panel header="First Name" key="1">
                    <Form.Item
                      name="firstName"
                      noStyle
                      rules={[
                        { required: true, message: "Please input First Name!" },
                      ]}
                    >
                      <Input
                        style={{ width: 160 }}
                        placeholder={`(${user?.firstName})`}
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
                          setSelectItem("firstName");
                        }}
                      />
                    </Popconfirm>
                  </Collapse.Panel>
                  <Collapse.Panel header="Last Name" key="2">
                    <Form.Item
                      name="lastName"
                      noStyle
                      rules={[
                        { required: true, message: "Please input Last Name!" },
                      ]}
                    >
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
                  </Collapse.Panel>
                  <Collapse.Panel header="Address" key="3">
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
                  </Collapse.Panel>
                  <Collapse.Panel header="Phone Number" key="4">
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
                  </Collapse.Panel>
                  <Collapse.Panel header="User Name (Email)" key="5">
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
                  </Collapse.Panel>
                  <Collapse.Panel header="Password" key="6">
                    <div className="d-flex justify-content-evenly">
                      {" "}
                      <div>
                        {" "}
                        <span>Mật khẩu hiện tại: </span>
                        <Form.Item name="checkPassword" noStyle>
                          <Input.Password
                            style={{ width: 160 }}
                            placeholder={`********`}
                          />
                        </Form.Item>
                      </div>
                      <div className="px-4">
                        {" "}
                        <span>Mật khẩu mới: </span>
                        <Form.Item name="newPassword" noStyle>
                          <Input.Password
                            style={{ width: 160 }}
                            placeholder={`********`}
                          />
                        </Form.Item>
                        <Popconfirm
                          title="Edit profile"
                          description="Are you sure to edit this password?"
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
                              setSelectItem("password");
                            }}
                          />
                        </Popconfirm>
                      </div>
                    </div>
                  </Collapse.Panel>
                </Collapse>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AccountInformation;
