import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Watermark,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import axios from "axios";
import {
  CheckCircleTwoTone,
  PlusCircleOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { format } from "timeago.js";
// Socket;
import { io } from "socket.io-client";

const Messages: React.FC<any> = () => {
  const URL_ENV: any =
    process.env.REACT_APP_BASE_URL || "http://localhost:9000";

  const formRef = useRef<any>(null);
  const [createForm] = Form.useForm();
  const [createConversationForm] = Form.useForm();

  //Get conversation
  const [conversations, setConversations] = useState<any>([]);
  //Create a conversation:
  const [openCreateConver, setOpenCreateConver] = useState(false);
  // const [newCoversations, setNewConversations] = useState<any>();

  //Get all User to Create conversation
  const [users, getUsers] = useState<any>([]);
  //Get Meessage
  const [messages, setMessages] = useState<any[any]>([]);

  const [arrivalMessage, setArrivalMessage] = useState<any>([]);
  //loading
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuthStore((state: any) => state);

  ///conversation infor
  const [conversationInfor, setConversationInfor] = useState<any>();

  //userOnline

  const [usersOnline, setUsersOnline] = useState<any>();
  // Setting socket.io

  const socket = useRef<any>();

  useEffect(() => {
    socket.current = io(URL_ENV);
  }, [URL_ENV]);

  useEffect(() => {
    socket.current.on("getMessage", (data: any) => {
      console.log("««««« data »»»»»", data);

      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
      // setRefresh((f) => f + 1);
    });
  }, []);

  // Get message live socket.io
  useEffect(() => {
    arrivalMessage &&
      // conversationInfor?.friends._id.includes(arrivalMessage.senderId)
      setMessages((prev: any) => [...prev, arrivalMessage]);
  }, [arrivalMessage, conversations, conversationInfor?.friends._id]);

  //Add user for socket.io
  useEffect(() => {
    socket.current.emit("addUser", auth.payload._id);
  }, [auth]);

  //Get User Online IO
  useEffect(() => {
    socket.current.on("getUsers", (users: any) => {
      setUsersOnline(users);
      setRefresh((f) => f + 1);
    });
  }, [auth]);

  //Get User Online after disconnect IO
  useEffect(() => {
    socket.current.on("userOffline", (users: any) => {
      setUsersOnline(users);
    });
  }, [auth]);

  //GEt all Users
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axios.get(`${URL_ENV}/employees`);
        const dataIn = res.data.results.filter(
          (item: any) => item._id !== auth.payload._id
        );
        getUsers(dataIn);
      } catch (err) {}
    };
    getAllUsers();
  }, [URL_ENV, auth.payload._id]);

  //Get conversation
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `${URL_ENV}/conversations/${auth.payload._id}`
        );

        setConversations(res.data);
        setLoading(true);
      } catch (err) {}
    };
    getConversations();
  }, [URL_ENV, auth.payload._id, refresh]);

  //Create a conversation

  const handleCreateConversation = async (e: any) => {
    if (e) {
      const conversationCreate = {
        senderId: `${auth.payload._id}`,
        receiverId: `${e.userId}`,
      };
      try {
        const res = await axios.post(
          `${URL_ENV}/conversations`,
          conversationCreate
        );
        if (res) {
          setRefresh((f) => f + 1);
        }
      } catch (error) {
        console.log("««««« error »»»»»", error);
      }
    } else {
      message.error("Please select a person", 2);
    }
  };

  //Function send message
  const handleSendMessages = async (e: any) => {
    const messageSend = {
      sender: auth.payload._id,
      text: e.text,
      conversationId: conversationInfor.conversationId,
    };

    const receiverId = conversationInfor.friends._id;

    socket.current.emit("sendMessage", {
      senderId: `${auth.payload._id}`,
      receiverId: receiverId,
      text: e.text,
    });

    try {
      const res = await axios.post(`${URL_ENV}/messages`, messageSend);
      setRefresh((f) => f + 1);
      setMessages([...messages, res.data]);
      createForm.resetFields();

      setTimeout(() => {
        const inputInstance = formRef.current.getFieldInstance("text");
        inputInstance.focus();
      }, 30);
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
  };

  //GET MESSAGE
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/messages/${conversationInfor.conversationId}`
        );
        setMessages(res.data);
      } catch (error) {}
    };
    getMessages();
  }, [conversationInfor, refresh]);

  /// PART OF CHATBOX

  // Scroll to the bottom of the messages after they are updated

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);
  scrollRef?.current?.scrollIntoView({ behavior: "smooth" });

  const [friendData, setFriendData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const conversationsWithAuthMember = conversations.filter((item: any) =>
        item.members.includes(auth.payload._id)
      );

      const friendPromises = conversationsWithAuthMember.map(
        async (item: any) => {
          const otherMembers = item.members.filter(
            (member: any) => member !== auth.payload._id
          );

          try {
            const response = await axios.get(
              `${URL_ENV}/employees/${otherMembers}`
            );
            const friendData = response.data.result; // Assuming the friend data is in the 'result' property
            const friendInfo = {
              conversationId: item._id,
              friends: friendData
                ? {
                    ...friendData,
                    _id: friendData._id.toString(),
                  }
                : null,
            };
            return friendInfo;
          } catch (error) {
            console.log("Error fetching friend information:", error);
            const friendInfo = {
              conversationId: item._id,
              friends: null,
            };
            return friendInfo;
          }
        }
      );

      const friendInfo = await Promise.all(friendPromises);
      setFriendData(friendInfo);
    };

    fetchData();
  }, [conversations, auth.payload._id, URL_ENV]);

  return (
    <>
      <Card style={{ minHeight: "84vh" }}>
        {!loading ? (
          <Card style={{ width: 300, marginTop: 16 }} loading={true}></Card>
        ) : (
          <Row>
            <Col xs={24} xl={6}>
              <div>
                <Button
                  onClick={() => setOpenCreateConver(true)}
                  type="primary"
                  shape="circle"
                  icon={<PlusCircleOutlined />}
                />{" "}
                <span className="text-primary">New conversation?</span>
              </div>
              <Modal
                open={openCreateConver}
                onCancel={() => setOpenCreateConver(false)}
                onOk={() => {
                  createConversationForm.submit();
                  setRefresh((f) => f + 1);
                  setOpenCreateConver(false);
                }}
                okText="Create"
              >
                <Form
                  className="container px-5"
                  form={createConversationForm}
                  name="createConversationForm"
                  onFinish={handleCreateConversation}
                >
                  <Form.Item
                    labelCol={{
                      span: 8,
                    }}
                    wrapperCol={{
                      span: 16,
                    }}
                    hasFeedback
                    label="userId"
                    name="userId"
                    rules={[
                      {
                        required: true,
                        message: "Please select a person",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      showSearch
                      placeholder="Select a person"
                      optionFilterProp="children"
                      filterOption={(input: any, option: any) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={users.map((item: any, index: any) => {
                        return {
                          label: `${item.firstName} ${item.lastName}`,
                          value: item._id,
                        };
                      })}
                    />
                  </Form.Item>{" "}
                </Form>
              </Modal>
              <div
                className="conversation"
                style={{ height: "125px", overflowY: "auto" }}
              >
                {friendData?.map((friends: any, index: any) => (
                  <div key={`${friends}-${index}`}>
                    <Button
                      onClick={() => setConversationInfor(friends)}
                      className="text-start"
                      style={{ width: "300px", height: "auto" }}
                    >
                      {friends?.friends?.firstName} {friends?.friends?.lastName}
                    </Button>
                  </div>
                ))}
              </div>
            </Col>
            <Col xs={24} xl={18}>
              {conversationInfor ? (
                <Card
                  type="inner"
                  title={`${conversationInfor?.friends.firstName} ${conversationInfor?.friends.lastName} 
                
                  `}
                  extra={
                    usersOnline?.some(
                      (user: any) =>
                        user.userId === conversationInfor.friends._id
                    ) ? (
                      <div>
                        <Space>
                          <CheckCircleTwoTone twoToneColor="#52c41a" />
                          Online
                        </Space>
                      </div>
                    ) : (
                      <div>
                        <Space>
                          <CheckCircleTwoTone twoToneColor="#eb2f96" />
                          Offline
                        </Space>
                      </div>
                    )
                  }
                  bordered={false}
                  style={{ width: "auto" }}
                >
                  <div
                    ref={scrollRef}
                    style={{ height: "400px", overflowY: "scroll" }}
                  >
                    {messages.map((item: any, index: number) => (
                      <>
                        {item?.employee?._id === auth.payload._id ? (
                          <div
                            key={`${item?._id}-me-${index}`}
                            className="d-flex flex-row-reverse"
                          >
                            <div className="w-auto">
                              <h6 className="Name text-body-secondary">
                                <UserOutlined /> Me
                              </h6>
                              <h5 className="bg-light-subtle border rounded-2 text-break px-2 py-2">
                                {item?.text}
                              </h5>
                              <div className="text-end">
                                {format(item.createdAt)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div key={`${item?._id}-${index}`} className="d-flex">
                            <div className="w-auto">
                              <h6 className="Name text-primary">
                                <UserOutlined /> {item?.employee?.firstName}{" "}
                                {item?.employee?.lastName}
                              </h6>
                              <h5 className="text-white bg-primary border rounded-2 px-2 py-2 text-break">
                                {item.text}
                              </h5>
                              <div className="text-start">
                                {format(item.createdAt)}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  </div>

                  <Form
                    style={{ marginTop: "50px" }}
                    key={conversationInfor}
                    form={createForm}
                    name="createForm"
                    onFinish={handleSendMessages}
                    ref={formRef}
                  >
                    <Space.Compact style={{ width: "100%" }}>
                      <Form.Item style={{ width: "100%" }} name="text">
                        <Input type="text" placeholder="Enter text" />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          icon={<SendOutlined />}
                          type="primary"
                          htmlType="submit"
                        />
                      </Form.Item>
                    </Space.Compact>
                  </Form>
                </Card>
              ) : (
                <Watermark content="Click to user to start conversation">
                  <div style={{ height: 500 }} />
                </Watermark>
              )}
            </Col>
          </Row>
        )}
      </Card>
    </>
  );
};

export default Messages;
