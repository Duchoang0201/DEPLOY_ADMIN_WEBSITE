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
function EmployeeCRUD() {
  const URL_ENV = process.env.REACT_APP_BASE_URL || "http://localhost:9000";

  //Set File avatar

  const [file, setFile] = useState<any>(null);

  const { auth } = useAuthStore((state: any) => state);

  const [refresh, setRefresh] = useState(0);

  // Date Picker Setting

  const { RangePicker } = DatePicker;
  dayjs.extend(customParseFormat);

  const dateFormat = "DD/MM/YYYY";

  // API OF COLLECTIOn
  let API_URL = `${URL_ENV}/employees`;

  // MODAL:
  // Modal open Create:
  const [openCreate, setOpenCreate] = useState(false);

  // Modal open Update:
  const [open, setOpen] = useState(false);

  //Model open Confirm Delete
  //Delete Item
  const [deleteItem, setDeleteItem] = useState<any>();

  //For fillter:

  //Data fillter
  const [employeesTEST, setEmployeesTEST] = useState<any>([]);

  // Change fillter (f=> f+1)

  const [updateId, setUpdateId] = useState<any>();

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

        ///FormData() giúp sumbit form mà k có nút sumbit
        //Túm váy lại, với FormData, chúng ta có thể submit dữ liệu lên server thông qua AJAX như là đang submit form bình thường.
        const formData = new FormData();
        //Phương thức append cho phép chúng ta chèn thêm một cặp key => value vào trong FormData
        formData.append("file", file);

        if (file?.uid && file?.type) {
          message.loading("On Updating picture on data!!", 1.5);
          axios
            .post(`${URL_ENV}/upload/employees/${_id}/image`, formData)
            .then((respose) => {
              message.success("Created Successfully!!", 1.5);
              createForm.resetFields();
              setOpenCreate(false);
              setFile(null);
              setTimeout(() => {
                setRefresh((f) => f + 1);
              }, 2000);
            });
        } else {
          createForm.resetFields();

          setOpenCreate(false);
          setFile(null);

          setTimeout(() => {
            setRefresh((f) => f + 1);
          }, 1000);
          message.success("Created Successfully!!", 1.5);
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(`${err?.response?.data?.message}`);
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
    if (record.isAdmin === undefined) {
      record.isAdmin = false;
    }
    axios
      .patch(API_URL + "/" + updateId._id, record)
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
    console.log("««««« value »»»»»", value);
    if (value) {
      setIsLocked(value);
    } else {
      setIsLocked("");
    }
  }, []);

  //SEARCH DEPEN ON NAME
  const [employeesEmail, setEmployeeEmail] = useState("");

  const onSearchEmployeeEmail = useCallback((value: any) => {
    console.log(value);
    if (value) {
      setEmployeeEmail(value);
    } else {
      setEmployeeEmail("");
    }
  }, []);

  //SEARCH DEPEN ON NAME
  const [employeesFirstName, setEmployeeFirstName] = useState("");

  const onSearchEmployeeFirstName = useCallback((value: any) => {
    console.log(value);
    if (value) {
      setEmployeeFirstName(value);
    } else {
      setEmployeeFirstName("");
    }
  }, []);

  //SEARCH DEPEN ON LastName
  const [employeesLastName, setEmployeeLastName] = useState("");

  const onSearchEmployeeLastName = (record: any) => {
    if (record) {
      setEmployeeLastName(record);
    } else {
      setEmployeeLastName("");
    }
  };

  //SEARCH DEPEN ON PhoneNumber
  const [employeesPhoneNumber, setEmployeePhoneNumber] = useState("");

  const onSearchEmployeePhoneNumber = (record: any) => {
    if (record) {
      setEmployeePhoneNumber(record);
    } else {
      setEmployeePhoneNumber("");
    }
  };

  //SEARCH DEPEN ON Address
  const [employeesAddress, setEmployeeAddress] = useState("");

  const onSearchEmployeeAddress = (record: any) => {
    if (record) {
      setEmployeeAddress(record);
    } else {
      setEmployeeAddress("");
    }
  };
  //SEARCH DEPEN ON Birthday
  const [employeesBirthdayFrom, setEmployeeBirthdayFrom] = useState("");
  const [employeesBirthdayTo, setEmployeeBirthdayTo] = useState("");

  const onSearchEmployeeBirthday = (record: any) => {
    const formattedRecord = record.map((date: any) =>
      dayjs(date).format("YYYY/MM/DD")
    );
    if (formattedRecord) {
      setEmployeeBirthdayFrom(formattedRecord[0]);
      setEmployeeBirthdayTo(formattedRecord[1]);
    } else {
      setEmployeeBirthdayFrom("");
      setEmployeeBirthdayTo("");
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
    employeesFirstName && `&firstName=${employeesFirstName}`,
    employeesLastName && `&lastName=${employeesLastName}`,
    employeesEmail && `&email=${employeesEmail}`,
    employeesPhoneNumber && `&phoneNumber=${employeesPhoneNumber}`,
    employeesAddress && `&address=${employeesAddress}`,
    employeesBirthdayFrom && `&birthdayFrom=${employeesBirthdayFrom}`,
    employeesBirthdayTo && `&birthdayTo=${employeesBirthdayTo}`,
    isLocked && `&Locked=${isLocked}`,
    skip && `&skip=${skip}`,
  ]
    .filter(Boolean)
    .join("")}&limit=10`;

  useEffect(() => {
    axios
      .get(URL_FILTER)
      .then((res) => {
        setEmployeesTEST(res.data.results);
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
                    label: "Locked",
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
          <div className="">
            {record.imageUrl && (
              <img
                src={`${URL_ENV}` + record.imageUrl}
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
            {employeesEmail ? (
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
              onSearch={onSearchEmployeeEmail}
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
            {employeesFirstName ? (
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
              onSearch={onSearchEmployeeFirstName}
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
            {employeesLastName ? (
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
              onSearch={onSearchEmployeeLastName}
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
            {employeesPhoneNumber ? (
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
              onSearch={onSearchEmployeePhoneNumber}
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
            {employeesAddress ? (
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
              onSearch={onSearchEmployeeAddress}
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
            {employeesBirthdayFrom || employeesBirthdayTo ? (
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
        return birthday && <span>{formattedBirthday}</span>;
      },
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <RangePicker
              onCalendarChange={() => {
                setEmployeeBirthdayFrom("");
                setEmployeeBirthdayTo("");
              }}
              allowClear
              defaultValue={[
                dayjs("01/01/1900", dateFormat),
                dayjs("01/01/2023", dateFormat),
              ]}
              format={dateFormat}
              onChange={onSearchEmployeeBirthday}
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
              setUpdateId(record);
              const birthdayFormat = moment(record.birthday);

              record.birthday = birthdayFormat;

              updateForm.setFieldsValue(record);
            }}
          />
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
            action={`${URL_ENV}/upload/employees/${record._id}/image`}
            headers={{ authorization: "authorization-text" }}
            onChange={(info) => {
              if (info.file.status !== "uploading") {
                console.log(info.file);
                message.loading("On Updating picture on data!!", 1.5);
              }

              if (info.file.status === "done") {
                setTimeout(() => {
                  setRefresh(refresh + 1);
                  message.success(
                    `${info.file.name} file uploaded successfully`
                  );
                }, 2000);
              } else if (info.file.status === "error") {
                message.error(`${info.file.name} file upload failed.`);
              }
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
                  setEmployeeEmail("");
                  setEmployeeFirstName("");
                  setEmployeeLastName("");
                  setEmployeePhoneNumber("");
                  setEmployeeAddress("");
                  setEmployeeBirthdayFrom("");
                  setEmployeeBirthdayTo("");
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
                Add Employee
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {/* Modal Create A employees */}
      <Modal
        title={`Create employees `}
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
              <DatePicker placement="bottomLeft" format={dateFormat} />
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
          // loading={!employeesTEST ? true : false}
          loading={loadingTable}
          rowKey="_id"
          columns={columns}
          dataSource={employeesTEST}
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
        title="Update Employee"
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
            <FormItem
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="isAdmin"
              name="isAdmin"
              valuePropName="checked"
            >
              <Switch />
            </FormItem>
            <Form.Item
              labelCol={{
                span: 8,
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
              <DatePicker placement="bottomLeft" format={dateFormat} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default EmployeeCRUD;
