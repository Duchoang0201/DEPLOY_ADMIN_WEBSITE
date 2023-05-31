import {
  CheckCircleOutlined,
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Upload,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { useAuthStore } from "../../hooks/useAuthStore";
// Date Picker
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
moment().format();
function CustomerCRUD() {
  //Set File avatar
  const URL_ENV = process.env.REACT_APP_BASE_URL || "http://localhost:9000";

  const [file, setFile] = useState<any>(null);

  const { auth } = useAuthStore((state: any) => state);

  const [refresh, setRefresh] = useState(0);

  // Date Picker Setting

  const { RangePicker } = DatePicker;
  dayjs.extend(customParseFormat);

  const dateFormat = "DD/MM/YYYY";

  // API OF COLLECTIOn
  let API_URL = `${URL_ENV}/customers`;

  // MODAL:
  // Modal open Create:
  const [openCreate, setOpenCreate] = useState(false);

  // Modal open Update:
  const [open, setOpen] = useState(false);

  //Delete Item
  const [deleteItem, setDeleteItem] = useState<any>();

  //For fillter:

  //Data fillter
  const [customersTEST, setCustomersTEST] = useState<any>([]);

  // Change fillter (f=> f+1)

  const [updateId, setUpdateId] = useState(0);

  //Create, Update Form setting
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  //Text of Tyography:

  //TableLoading

  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingTable(false);
    }, 1000); // 5000 milliseconds = 5 seconds
  }, []);

  //Create data
  const handleCreate = (record: any) => {
    record.createdBy = {
      employeeId: auth.payload._id,
      firstName: auth.payload.firstName,
      lastName: auth.payload.lastName,
    };
    record.createdDate = new Date().toISOString();
    if (record.Locked === undefined) {
      record.Locked = false;
    }

    axios
      .post(API_URL, record)
      .then((res) => {
        // UPLOAD FILE
        const { _id } = res.data.result;

        const formData = new FormData();
        formData.append("file", file);

        axios
          .post(`${URL_ENV}/upload/customers/${_id}/image`, formData)
          .then((respose) => {
            message.success("Thêm mới thành công!");
            createForm.resetFields();
            setOpenCreate(false);
            setFile(null);

            setTimeout(() => {
              setRefresh((f) => f + 1);
            }, 2000);
          });
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
      });
  };
  //Delete a Data
  const handleDelete = (record: any) => {
    axios
      .delete(API_URL + "/" + record._id)
      .then((res) => {
        message.success(" Delete item sucessfully!!", 1.5);
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Update a Data
  const handleUpdate = (record: any) => {
    record.updatedBy = {
      employeeId: auth.payload._id,
      firstName: auth.payload.firstName,
      lastName: auth.payload.lastName,
    };
    record.updatedDate = new Date().toISOString();

    record.birthday = record.birthday.toISOString();
    axios
      .patch(API_URL + "/" + updateId, record)
      .then((res) => {
        console.log(res);
        setOpen(false);
        setOpenCreate(false);
        setRefresh((f) => f + 1);
        message.success("Updated sucessfully!!", 1.5);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //SEARCH ISDELETE , ACTIVE, UNACTIVE ITEM

  const [isLocked, setIsLocked] = useState("");
  const onSearchIsLocked = useCallback((value: any) => {
    if (value) {
      setIsLocked(value);
    } else {
      setIsLocked("");
    }
  }, []);

  //SEARCH DEPEN ON NAME
  const [customerEmail, setCustomerEmail] = useState("");

  const onSearchCustomerEmail = useCallback((value: any) => {
    console.log(value);
    if (value) {
      setCustomerEmail(value);
    } else {
      setCustomerEmail("");
    }
  }, []);

  //SEARCH DEPEN ON NAME
  const [customerFirstName, setCustomerFirstName] = useState("");

  const onSearchCustomerFirstName = useCallback((value: any) => {
    console.log(value);
    if (value) {
      setCustomerFirstName(value);
    } else {
      setCustomerFirstName("");
    }
  }, []);

  //SEARCH DEPEN ON LastName
  const [customerLastName, setCustomerLastName] = useState("");

  const onSearchCustomerLastName = (record: any) => {
    if (record) {
      setCustomerLastName(record);
    } else {
      setCustomerLastName("");
    }
  };

  //SEARCH DEPEN ON PhoneNumber
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");

  const onSearchCustomerPhoneNumber = (record: any) => {
    if (record) {
      setCustomerPhoneNumber(record);
    } else {
      setCustomerPhoneNumber("");
    }
  };

  //SEARCH DEPEN ON Address
  const [customerAddress, setCustomerAddress] = useState("");

  const onSearchCustomerAddress = (record: any) => {
    if (record) {
      setCustomerAddress(record);
    } else {
      setCustomerAddress("");
    }
  };
  //SEARCH DEPEN ON Birthday
  const [customerBirthdayFrom, setCustomerBirthdayFrom] = useState("");
  const [customerBirthdayTo, setCustomerBirthdayTo] = useState("");

  const onSearchCustomerBirthday = (record: any) => {
    const formattedRecord = record.map((date: any) =>
      dayjs(date).format("YYYY/MM/DD")
    );
    console.log("««««« formattedRecord »»»»»", formattedRecord);
    if (formattedRecord) {
      setCustomerBirthdayFrom(formattedRecord[0]);
      setCustomerBirthdayTo(formattedRecord[1]);
    } else {
      setCustomerBirthdayFrom("");
      setCustomerBirthdayTo("");
    }
  };

  //Search on Skip and Limit

  const [pages, setPages] = useState();
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const slideCurrent = (value: any) => {
    setSkip(value * 10 - 10);
    setCurrentPage(value);
  };
  //GET DATA ON FILLTER
  const URL_FILTER = `${API_URL}?${[
    customerFirstName && `&firstName=${customerFirstName}`,
    customerLastName && `&lastName=${customerLastName}`,
    customerEmail && `&email=${customerEmail}`,
    customerPhoneNumber && `&phoneNumber=${customerPhoneNumber}`,
    customerAddress && `&address=${customerAddress}`,
    customerBirthdayFrom && `&birthdayFrom=${customerBirthdayFrom}`,
    customerBirthdayTo && `&birthdayTo=${customerBirthdayTo}`,
    isLocked && `&Locked=${isLocked}`,
    skip && `&skip=${skip}`,
  ]
    .filter(Boolean)
    .join("")}&limit=10`;

  useEffect(() => {
    axios
      .get(URL_FILTER)
      .then((res) => {
        setCustomersTEST(res.data.results);
        setPages(res.data.amountResults);
      })
      .catch((err) => console.log(err));
  }, [URL_FILTER, refresh]);

  //Setting column
  const columns = [
    //NO
    {
      title: () => {
        return (
          <div>
            {isLocked ? (
              <div className="text-danger">No</div>
            ) : (
              <div className="secondary">No</div>
            )}
          </div>
        );
      },
      dataIndex: "id",
      key: "id",
      render: (text: string, record: any, index: number) => {
        return (
          <div>
            <Space>
              {" "}
              {currentPage === 1 ? index + 1 : index + currentPage * 10 - 9}
              {record.Locked === false && (
                <span style={{ fontSize: "16px", color: "#08c" }}>
                  <CheckCircleOutlined /> Active
                </span>
              )}
              {record.Locked === true && (
                <span style={{ fontSize: "16px", color: "#dc3545" }}>
                  <CheckCircleOutlined /> Locked
                </span>
              )}
            </Space>
          </div>
        );
      },
      filterDropdown: () => {
        return (
          <>
            <div>
              <Select
                allowClear
                onClear={() => {
                  setIsLocked("");
                }}
                style={{ width: "125px" }}
                placeholder="Select a supplier"
                optionFilterProp="children"
                showSearch
                onChange={onSearchIsLocked}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "false",
                    label: "Active",
                  },

                  {
                    value: "true",
                    label: "Deleted",
                  },
                ]}
              />
            </div>
          </>
        );
      },
    },
    //IMAGE
    {
      width: "10%",

      title: "Picture",
      key: "imageUrl",
      dataIndex: "imageUrl",
      render: (text: any, record: any, index: any) => {
        return (
          <div>
            {record.imageUrl && (
              <img
                src={`${URL_ENV}${record.imageUrl}`}
                style={{ height: 60 }}
                alt="record.imageUrl"
              />
            )}
          </div>
        );
      },
    },
    //Email
    {
      title: () => {
        return (
          <div>
            {customerEmail ? (
              <div className="text-danger">Email</div>
            ) : (
              <div className="secondary">Email</div>
            )}
          </div>
        );
      },
      dataIndex: "email",
      key: "email",
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Search
              allowClear
              onSearch={onSearchCustomerEmail}
              placeholder="input search text"
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    //First Name
    {
      title: () => {
        return (
          <div>
            {customerFirstName ? (
              <div className="text-danger">First name</div>
            ) : (
              <div className="secondary">First name</div>
            )}
          </div>
        );
      },
      dataIndex: "firstName",
      key: "firstName",
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Search
              allowClear
              placeholder="input search text"
              onSearch={onSearchCustomerFirstName}
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    //Last Name
    {
      title: () => {
        return (
          <div>
            {customerLastName ? (
              <div className="text-danger">Last name</div>
            ) : (
              <div className="secondary">Last name</div>
            )}
          </div>
        );
      },
      dataIndex: "lastName",
      key: "lastName",
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Search
              allowClear
              onSearch={onSearchCustomerLastName}
              placeholder="input search text"
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    //Phone number
    {
      title: () => {
        return (
          <div>
            {customerPhoneNumber ? (
              <div className="text-danger">Phone Number</div>
            ) : (
              <div className="secondary">Phone Number</div>
            )}
          </div>
        );
      },
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Search
              onSearch={onSearchCustomerPhoneNumber}
              allowClear
              placeholder="input search text"
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    //Address
    {
      title: () => {
        return (
          <div>
            {customerAddress ? (
              <div className="text-danger">Address</div>
            ) : (
              <div className="secondary">Address</div>
            )}
          </div>
        );
      },
      dataIndex: "address",
      key: "address",
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Search
              allowClear
              onSearch={onSearchCustomerAddress}
              placeholder="input search text"
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    //Birthday
    {
      title: () => {
        return (
          <div>
            {customerBirthdayFrom || customerBirthdayTo ? (
              <div className="text-danger">Birthday</div>
            ) : (
              <div className="secondary">Birthday</div>
            )}
          </div>
        );
      },
      dataIndex: "birthday",
      key: "birthday",
      render: (birthday: any) => {
        const formattedBirthday = dayjs(birthday).format("DD/MM/YYYY");
        return <span>{formattedBirthday}</span>;
      },
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <RangePicker
              onCalendarChange={() => {
                setCustomerBirthdayFrom("");
                setCustomerBirthdayTo("");
              }}
              allowClear
              defaultValue={[
                dayjs("01/01/1900", dateFormat),
                dayjs("01/01/2023", dateFormat),
              ]}
              format={dateFormat}
              onChange={onSearchCustomerBirthday}
            />
          </div>
        );
      },
    },
    //Note

    { title: "Note", dataIndex: "note", key: "note", width: "10%" },

    //function
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (text: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setOpen(true);
              setUpdateId(record._id);
              const birthdayFormat = moment(record.birthday);
              record.birthday = birthdayFormat;
              updateForm.setFieldsValue(record);
            }}
          ></Button>
          <Popconfirm
            okText="Delete"
            okType="danger"
            onConfirm={() => handleDelete(deleteItem)}
            title={"Are you sure to delete this product?"}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                setDeleteItem(record);
              }}
            ></Button>
          </Popconfirm>
          <Upload
            showUploadList={false}
            name="file"
            action={`${URL_ENV}/upload/customers/${record._id}/image`}
            headers={{ authorization: "authorization-text" }}
            onChange={(info) => {
              if (info.file.status !== "uploading") {
                console.log(info.file);
              }

              if (info.file.status === "done") {
                message.success(`${info.file.name} file uploaded successfully`);
              } else if (info.file.status === "error") {
                message.error(`${info.file.name} file upload failed.`);
              }
              setTimeout(() => {
                setRefresh(refresh + 1);
              }, 2000);
            }}
          >
            <Button icon={<UploadOutlined />} />
          </Upload>
        </Space>
      ),
      filterDropdown: () => {
        return (
          <>
            <Space direction="vertical">
              <Button
                style={{ width: "150px" }}
                onClick={() => {
                  setCustomerEmail("");
                  setCustomerFirstName("");
                  setCustomerLastName("");
                  setCustomerPhoneNumber("");
                  setCustomerAddress("");
                  setCustomerBirthdayFrom("");
                  setCustomerBirthdayTo("");
                  setIsLocked("");
                }}
                icon={<ClearOutlined />}
              >
                Clear filter
              </Button>
              <Button
                style={{ width: "150px" }}
                onClick={() => {
                  setOpenCreate(true);
                }}
                icon={<PlusCircleOutlined />}
              >
                Add Customer
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {/* Modal Create A Customers */}
      <Modal
        title={`Create Customers `}
        open={openCreate}
        onCancel={() => {
          setOpenCreate(false);
        }}
        onOk={() => {
          createForm.submit();
        }}
        okText="Submit"
      >
        <div className="container ">
          <Form form={createForm} name="createForm" onFinish={handleCreate}>
            <FormItem
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
                { required: true, message: "Please input Email!" },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="First name"
              name="firstName"
              rules={[{ required: true, message: "Please input First name!" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Last name"
              name="lastName"
              rules={[{ required: true, message: "Please input Last name!" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Phone number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input Phone number!" },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please input Address!" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input Address!" }]}
            >
              <Input.Password />
            </FormItem>
            <FormItem
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Locked"
              name="Locked"
              valuePropName="checked"
            >
              <Switch />
            </FormItem>
            <Form.Item
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Note"
              name="note"
            >
              <Input />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="Birthday"
              name="birthday"
              rules={[{ required: true, message: "Please input Birthday!" }]}
            >
              <DatePicker placement="bottomLeft" format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="Hình minh họa"
              name="file"
            >
              <Upload
                maxCount={1}
                listType="picture-card"
                showUploadList={true}
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
                onRemove={() => {
                  setFile("");
                }}
              >
                {!file ? (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                ) : (
                  ""
                )}
              </Upload>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* List and function  */}

      <div>
        <Table
          // loading={!customersTEST ? true : false}
          loading={loadingTable}
          rowKey="_id"
          columns={columns}
          dataSource={customersTEST}
          pagination={false}
          scroll={{ x: "max-content", y: 610 }}
          rowClassName={(record) => {
            return record.Locked === true
              ? "text-danger bg-success-subtle"
              : "";
          }}
        />
        <Pagination
          className="container text-end"
          onChange={(e) => slideCurrent(e)}
          defaultCurrent={1}
          total={pages}
        />
      </div>

      {/* Modal confirm Delte */}

      {/* Model Update */}
      <Modal
        open={open}
        title="Update Customer"
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form form={updateForm} name="updateForm" onFinish={handleUpdate}>
          <div className="row">
            <FormItem
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input Email!" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="First name"
              name="firstName"
              rules={[{ required: true, message: "Please input First name!" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Last name"
              name="lastName"
              rules={[{ required: true, message: "Please input Last name!" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Phone number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input Phone number!" },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please input Address!" }]}
            >
              <Input />
            </FormItem>

            <FormItem
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Locked"
              name="Locked"
              valuePropName="checked"
            >
              <Switch />
            </FormItem>
            <Form.Item
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Note"
              name="note"
            >
              <Input />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="Birthday"
              name="birthday"
              rules={[{ required: true, message: "Please input Birthday!" }]}
            >
              <DatePicker placement="bottomLeft" format="DD/MM/YYYY" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default CustomerCRUD;
