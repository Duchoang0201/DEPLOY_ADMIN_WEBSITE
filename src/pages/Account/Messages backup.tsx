import {
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
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
  PlusCircleOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { format } from "timeago.js";
// Socket;
import { io } from "socket.io-client";
interface Conversation {
  _id: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Messages: React.FC<any> = () => {
  const formRef = useRef<any>(null);
  const [createForm] = Form.useForm();
  const [createConversationForm] = Form.useForm();

  //Get conversation
  const [conversations, setConversations] = useState<any>([]);
  console.log("««««« conversations »»»»»", conversations);
  //Create a conversation:
  const [openCreateConver, setOpenCreateConver] = useState(false);
  // const [newCoversations, setNewConversations] = useState<any>();
  //Data
  const [dataUserMenu, setDataUserMenu] = useState<any[]>([]);

  //Get all User to Create conversation
  const [users, getUsers] = useState<any>([]);
  //Get Meessage
  const [messages, setMessages] = useState<any[any]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<any>([]);
  console.log("««««« arrivalMessage »»»»»", arrivalMessage);
  //loading
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuthStore((state: any) => state);

  //active tab key
  const [activeTabKey1, setActiveTabKey1] = useState<any>();

  // Setting socket.io

  const socket = useRef<any>();
  useEffect(() => {
    socket.current = io("http://localhost:8888");
    socket.current.on("getMessage", (data: any) => {
      console.log("««««« data »»»»»", data);
      if (data == null) {
        setRefresh((f) => f + 1);
      } else {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
        //or setRefresh((f) => f + 1);
      }
    });
  }, []);

  // Get message live socket.io
  useEffect(() => {
    arrivalMessage &&
      conversationCurrent?.members.includes(arrivalMessage.senderId);
    setMessages((prev: any) => [...prev, arrivalMessage]);
  }, [arrivalMessage, conversations]);

  //Add user for socket.io
  useEffect(() => {
    socket.current.emit("addUser", auth.payload._id);
  }, [auth]);
  //GEt all Users
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/employees`);
        const dataIn = res.data.results.filter(
          (item: any) => item._id !== auth.payload._id
        );
        getUsers(dataIn);
      } catch (err) {}
    };
    getAllUsers();
  }, [auth.payload._id]);

  //Get conversation
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/conversations/${auth.payload._id}`
        );

        setConversations(res.data);
        setLoading(true);
      } catch (err) {}
    };
    getConversations();
  }, [auth.payload._id, refresh]);

  //Create a conversation

  const handleCreateConversation = async (e: any) => {
    if (e) {
      const conversationCreate = {
        senderId: `${auth.payload._id}`,
        receiverId: `${e.userId}`,
      };
      try {
        const res = await axios.post(
          `http://localhost:9000/conversations`,
          conversationCreate
        );
        setRefresh((f) => f + 1);
      } catch (error) {
        console.log("««««« error »»»»»", error);
      }
    } else {
      message.error("Please select a person", 2);
    }
  };

  //GET Menu user to chat

  useEffect(() => {
    const friendId = conversations.flatMap((object: { members: any[] }): any =>
      object.members.filter((memberId: any) => memberId !== auth.payload._id)
    );

    const query = friendId
      .map((employeeId: string) => `employeeId=${employeeId}`)
      .join("&");
    const getUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/employees/${friendId}`
        );
        setDataUserMenu(res.data.results);
      } catch (error) {}
    };
    getUser();
  }, [auth.payload._id, conversations]);

  //Function Get ConversationId back

  const memberId1 = `${auth.payload._id}`;
  const memberId2 = `${activeTabKey1?._id}`;
  function getConversationIdByMembers(
    conversations: Conversation[],
    memberId1: string,
    memberId2: string
  ): any {
    const conversation = conversations.find(
      (conv) =>
        conv.members.includes(memberId1) && conv.members.includes(memberId2)
    );
    return conversation ? conversation : null;
  }

  const conversationCurrent = getConversationIdByMembers(
    conversations,
    memberId1,
    memberId2
  );

  console.log("««««« conversationCurrent »»»»»", conversationCurrent);
  //Function send message
  const handleSendMessages = async (e: any) => {
    const messageSend = {
      sender: auth.payload._id,
      text: e.text,
      conversationId: conversationCurrent._id,
    };

    const receiverId = conversationCurrent.members.find(
      (member: any) => member !== auth.payload._id
    );

    socket.current.emit("sendMessage", {
      senderId: `${auth.payload._id}`,
      receiverId: receiverId,
      text: e.text,
    });

    try {
      const res = await axios.post(
        "http://localhost:9000/messages",
        messageSend
      );
      setRefresh((f) => f + 1);
      setMessages([...messages, res.data]);
      createForm.resetFields();

      setTimeout(() => {
        const inputInstance = formRef.current.getFieldInstance("text");
        inputInstance.focus();
      }, 0);
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
  };

  //GET MESSAGE
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/messages/${conversationCurrent._id}`
        );
        setMessages(res.data);
      } catch (error) {}
    };
    getMessages();
  }, [activeTabKey1, conversationCurrent, refresh]);
  //For scroll when scroll down menu user
  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 400) {
    }
  };

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
              `http://localhost:9000/employees/${otherMembers}`
            );
            return response.data;
          } catch (error) {
            console.log("Error fetching friend information:", error);
            return [];
          }
        }
      );

      const friendInfo = await Promise.all(friendPromises);
      console.log("««««« friendInfo »»»»»", friendInfo);
      setFriendData(friendInfo);
    };

    fetchData();
  }, [conversations]);

  console.log("««««« frienđate »»»»»", friendData);
  return (
    <>
      <Card style={{ minHeight: "84vh" }}>
        {!loading ? (
          <Card style={{ width: 300, marginTop: 16 }} loading={true}></Card>
        ) : (
          <Row>
            <Col xs={24} xl={5}>
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
              <div className="conversation">
                {friendData?.map((friends: any, index: any) => {
                  return (
                    <div key={index}>
                      <Button
                        key={index}
                        className="text-start"
                        style={{ width: "300px", height: "auto" }}
                      >
                        {friends?.result?.firstName}
                      </Button>
                    </div>
                  );
                })}
              </div>
              {/* <List>
                <VirtualList
                  data={dataUserMenu}
                  height={300}
                  itemHeight={50}
                  itemKey="_id"
                  onScroll={onScroll}
                >
                  {(item: any) => (
                    <List.Item key={item._id}>
                      <Button
                        onClick={() => setActiveTabKey1(item)}
                        className="text-start "
                        style={{ width: "300px", height: "auto" }}
                      >
                        <List.Item.Meta
                          // avatar={<Avatar src={item.picture.large} />}
                          avatar={<UserOutlined />}
                          title={
                            <div>
                              {" "}
                              {item.firstName}
                              <span> </span>
                              {item.lastName}
                            </div>
                          }
                          description={item.email}
                        />
                      </Button>
                    </List.Item>
                  )}
                </VirtualList>
              </List> */}
            </Col>
            <Col xs={24} xl={19}>
              {activeTabKey1 ? (
                <Card
                  type="inner"
                  title={`${activeTabKey1?.firstName} ${activeTabKey1?.lastName}`}
                  bordered={false}
                  style={{ width: "auto" }}
                >
                  <div
                    id="scrollUP"
                    ref={scrollRef}
                    style={{ height: "400px", overflowY: "scroll" }}
                  >
                    {messages.map((item: any) => (
                      <>
                        {item?.employee?._id === auth.payload._id ? (
                          <div
                            key={item.employee._id}
                            className="d-flex flex-row-reverse"
                          >
                            <div key={item?._id} className=" w-auto">
                              <h6 className="Name text-body-secondary ">
                                <UserOutlined /> Me
                              </h6>{" "}
                              <h5 className=" bg-light-subtle border rounded-2 text-break px-2 py-2 ">
                                {item?.text}
                              </h5>{" "}
                              <div className=" text-end ">
                                {format(item.createdAt)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex ">
                            <div key={item?._id} className=" w-auto">
                              <h6 className="Name text-primary ">
                                {" "}
                                <UserOutlined /> {
                                  item?.employee?.firstName
                                }{" "}
                                {item?.employee?.lastName}
                              </h6>
                              <h5 className=" text-white  bg-primary border rounded-2 px-2 py-2 text-break ">
                                {item.text}
                              </h5>{" "}
                              <div className="text-start ">
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
                    key={activeTabKey1}
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
