import {
  CheckCircleOutlined,
  ClearOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { useAuthStore } from "../../hooks/useAuthStore";

interface ISupplier {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

function SupperliersCRUD() {
  const URL_ENV = process.env.REACT_APP_BASE_URL || "http://localhost:9000";

  const [refresh, setRefresh] = useState(0);
  const { auth } = useAuthStore((state: any) => state);

  let API_URL = `${URL_ENV}/suppliers`;

  // MODAL:
  // Modal open Create:
  const [openCreate, setOpenCreate] = useState(false);

  // Modal open Update:
  const [open, setOpen] = useState(false);

  //Delete Item
  const [deleteItem, setDeleteItem] = useState<ISupplier>();

  //For fillter:

  //Data fillter
  const [supplierTEST, setSupplierTEST] = useState<Array<any>>([]);

  // Change fillter (f=> f+1)
  // const [supplierFilter, setSupplierFilter] = useState(API_URL);

  const [updateId, setUpdateId] = useState(0);

  //Create, Update Form setting
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  //TableLoading

  const [loadingTable, setLoadingTable] = useState(true);

  //Text of Tyography:

  //Create data
  const handleCreate = (record: any) => {
    record.createdBy = {
      employeeId: auth.payload._id,
      firstName: auth.payload.firstName,
      lastName: auth.payload.lastName,
    };
    record.createdDate = new Date().toISOString();
    if (record.active === undefined) {
      record.active = false;
    }
    record.isDeleted = false;

    axios
      .post(API_URL, record)
      .then((res) => {
        setRefresh((f) => f + 1);
        setOpenCreate(false);

        message.success(" Add new Suppliers sucessfully!", 1.5);
        createForm.resetFields();
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
    if (record.active === undefined) {
      record.active = false;
    }
    if (record.isDeleted === undefined) {
      record.isDeleted = false;
    }
    axios
      .patch(API_URL + "/" + updateId, record)
      .then((res) => {
        setOpen(false);
        setOpenCreate(false);
        setRefresh((f) => f + 1);
        message.success("Updated sucessfully!!", 1.5);
      })
      .catch((err) => {
        console.log(err);
        message.error(`${err.response.data.message}`, 2);
      });
  };

  //SEARCH ISDELETE ITEM

  //SEARCH ISDELETE , ACTIVE, UNACTIVE ITEM

  const [isDelete, setIsDelete] = useState("");
  const [isActive, setIsActive] = useState("");
  const onSearchIsDelete = useCallback((value: any) => {
    if (value === "active") {
      setIsActive("true");
      setIsDelete("");
    }
    if (value === "unActive") {
      setIsActive("false");
      setIsDelete("");
    }
    if (value === "Deleted") {
      setIsDelete("true");
      setIsActive("");
    }
    if (value !== "active" && value !== "unActive" && value !== "Deleted") {
      setIsActive("");
      setIsDelete("");
    }
  }, []);

  //SEARCH DEPEN ON NAME
  const [supplierName, setSuplierName] = useState("");

  const onSearchSupplierName = useCallback((value: any) => {
    if (value) {
      setSuplierName(value);
    } else {
      setSuplierName("");
    }
  }, []);

  //SEARCH DEPEN ON EMAIL
  const [supplierEmail, setSuplierEmail] = useState("");

  const onSearchProductEmail = (record: any) => {
    setSuplierEmail(record);
  };
  //SEARCH DEPEN ON PHONENUMBER
  const [supplierPhone, setSuplierPhone] = useState("");

  const onSearchProductPhone = (record: any) => {
    setSuplierPhone(record);
  };

  //SEARCH DEPEN ON ADDRESS
  const [supplierAddress, setSuplierAddress] = useState("");

  const onSearchProductAddress = (record: any) => {
    if (record) {
      setSuplierAddress(record);
    } else {
      setSuplierAddress("");
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
  const URL_FILTER = `${URL_ENV}/suppliers?${[
    supplierName && `name=${supplierName}`,
    supplierEmail && `email=${supplierEmail}`,
    supplierPhone && `phoneNumber=${supplierPhone}`,
    supplierAddress && `address=${supplierAddress}`,
    isActive && `active=${isActive}`,
    isDelete && `isDeleted=${isDelete}`,
    skip && `skip=${skip}`,
  ]
    .filter(Boolean)
    .join("&")}&limit=10`;

  useEffect(() => {
    axios
      .get(URL_FILTER)
      .then((res) => {
        setSupplierTEST(res.data.results);
        setPages(res.data.amountResults);
        setLoadingTable(false);
      })
      .catch((err) => console.log(err));
  }, [URL_FILTER, refresh]);

  //Setting column
  const columns = [
    //No
    {
      title: () => {
        return (
          <div>
            {isActive || isDelete ? (
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
              {currentPage === 1 ? index + 1 : index + currentPage * 10 - 9}
              {record.active === true && !record.isDeleted && (
                <span style={{ fontSize: "16px", color: "#08c" }}>
                  <CheckCircleOutlined /> Active
                </span>
              )}
              {record.active === false && !record.isDeleted && (
                <span className="text-danger">
                  <CloseCircleOutlined
                    style={{ fontSize: "16px", color: "#dc3545" }}
                  />{" "}
                  Unactive
                </span>
              )}

              {record.isDeleted === true && (
                <span className="text-danger">
                  <CloseCircleOutlined
                    style={{ fontSize: "16px", color: "#dc3545" }}
                  />{" "}
                  Deleted
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
                  setIsDelete("");
                }}
                style={{ width: "125px" }}
                placeholder="Select a supplier"
                optionFilterProp="children"
                showSearch
                onChange={onSearchIsDelete}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "active",
                    label: "Active",
                  },
                  {
                    value: "unActive",
                    label: "Unactive",
                  },
                  {
                    value: "Deleted",
                    label: "Deleted",
                  },
                ]}
              />
            </div>
          </>
        );
      },
      width: "10%",
    },
    //Email
    {
      title: () => {
        return (
          <div>
            {supplierEmail ? (
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
              placeholder="Enter email"
              onSearch={onSearchProductEmail}
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    //Name
    {
      title: () => {
        return (
          <div>
            {supplierName ? (
              <div className="text-danger">Name</div>
            ) : (
              <div className="secondary">Name</div>
            )}
          </div>
        );
      },
      dataIndex: "name",
      key: "_id", // key added here
      filterDropdown: () => {
        return (
          <>
            <div>
              <Select
                allowClear
                // autoClearSearchValue={!supplierId ? true : false}
                onClear={() => {
                  setSuplierName("");
                }}
                style={{ width: "125px" }}
                placeholder="Select a supplier"
                optionFilterProp="children"
                onChange={onSearchSupplierName}
                showSearch
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={supplierTEST.map((item: any, index: any) => {
                  return {
                    label: `${item.name}`,
                    value: item.name,
                  };
                })}
              />
            </div>
          </>
        );
      },
    },
    //Phone Number
    {
      title: () => {
        return (
          <div>
            {supplierPhone ? (
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
              allowClear
              placeholder="Enter phone number"
              onSearch={onSearchProductPhone}
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
            {supplierAddress ? (
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
              placeholder="Enter address"
              onSearch={onSearchProductAddress}
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    //Note

    { title: "Note", dataIndex: "note", key: "note", width: "10%" },

    //Function
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
        </Space>
      ),
      filterDropdown: () => {
        return (
          <>
            <Space direction="vertical">
              <Button
                style={{ width: "150px" }}
                onClick={() => {
                  setSuplierName("");
                  setSuplierEmail("");
                  setSuplierPhone("");
                  setSuplierAddress("");
                  setIsActive("");
                  setIsDelete("");
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
                Add Supplier
              </Button>
            </Space>
          </>
        );
      },
    },
  ];
  return (
    <div>
      {/* Modal Create A SUPPLIER */}

      <Modal
        title={`Create Supplier `}
        open={openCreate}
        onCancel={() => {
          setOpenCreate(false);
        }}
        onOk={() => {
          createForm.submit();
        }}
        okText="Submit"
      >
        <div className="container d-flex flex-row ">
          <Form form={createForm} name="createForm" onFinish={handleCreate}>
            <div className="row">
              <FormItem
                labelCol={{
                  span: 7,
                }}
                wrapperCol={{
                  span: 16,
                }}
                hasFeedback
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input Name!" }]}
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
                label="Email"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Please enter a valid email address!",
                  },
                  {
                    required: true,
                    message: "Please enter your email address!",
                  },
                ]}
              >
                <Input />
              </FormItem>
            </div>
            <div className="row">
              {" "}
              <FormItem
                hasFeedback
                label="Phone"
                name="phoneNumber"
                labelCol={{
                  span: 7,
                }}
                wrapperCol={{
                  span: 16,
                }}
                rules={[
                  {
                    pattern: /^[+]?[0-9]{8,}$/,
                    message: "Please enter a valid phone number!",
                  },
                  {
                    required: true,
                    message: "Please enter your phone number!",
                  },
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
                rules={[{ required: true, message: "Please input Email!" }]}
              >
                <Input />
              </FormItem>
              <Form.Item
                labelCol={{
                  span: 7,
                }}
                wrapperCol={{
                  span: 16,
                }}
                hasFeedback
                label="active"
                name="active"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
              <Form.Item
                labelCol={{
                  span: 7,
                }}
                wrapperCol={{
                  span: 16,
                }}
                hasFeedback
                label="sortOder"
                name="sortOder"
              >
                <InputNumber min={1} />
              </Form.Item>
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
            </div>
          </Form>
        </div>
      </Modal>

      {/* List and function  */}
      <Table
        loading={loadingTable}
        rowKey="_id"
        columns={columns}
        dataSource={supplierTEST}
        pagination={false}
        scroll={{ x: "max-content", y: "max-content" }}
        rowClassName={(record) => {
          if (record.active === false && record.isDeleted === false) {
            return "bg-dark-subtle";
          } else if (record.isDeleted) {
            return "text-danger bg-success-subtle";
          } else {
            return "";
          }
        }}
      >
        {" "}
      </Table>

      {/* Model Update */}
      <Modal
        open={open}
        title="Update supplier"
        onCancel={() => setOpen(false)}
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form form={updateForm} name="updateForm" onFinish={handleUpdate}>
          <div className="row">
            <FormItem
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input Name!" }]}
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
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input Email!" }]}
            >
              <Input />
            </FormItem>
          </div>
          <div className="row">
            {" "}
            <FormItem
              hasFeedback
              label="Phone"
              name="phoneNumber"
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
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
              rules={[{ required: true, message: "Please input Email!" }]}
            >
              <Input />
            </FormItem>
            <Form.Item
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="active"
              name="active"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="isDeleted"
              name="isDeleted"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
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
          </div>
        </Form>
      </Modal>
      <Pagination
        className="container text-end"
        onChange={(e) => slideCurrent(e)}
        defaultCurrent={1}
        total={pages}
      />
    </div>
  );
}

export default SupperliersCRUD;
