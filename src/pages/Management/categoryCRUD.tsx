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
import React, { useCallback, useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { useAuthStore } from "../../hooks/useAuthStore";
// Date Picker

function CategoryCRUD() {
  const { auth } = useAuthStore((state: any) => state);
  const [refresh, setRefresh] = useState(0);

  // Date Picker Setting

  // API OF
  let API_URL = "http://localhost:9000/categories";

  // MODAL:
  // Modal open Create:
  const [openCreate, setOpenCreate] = useState(false);

  // Modal open Update:
  const [open, setOpen] = useState(false);

  //Model open Confirm Delete
  // const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  //Delete Item
  const [deleteItem, setDeleteItem] = useState<any>();

  //For fillter:

  //Data fillter
  const [categoryTEST, setCategoryTEST] = useState<any>([]);

  // Change fillter (f=> f+1)

  const [updateId, setUpdateId] = useState(0);

  //Create, Update Form setting
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  //TableLoading

  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingTable(false);
    }, 1000); // 5000 milliseconds = 5 seconds
  }, []);

  //Text of Tyography:

  //Create data
  const handleCreate = (record: any) => {
    record.createdBy = auth.payload;
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

        message.success(" Add new Category sucessfully!", 1.5);
        createForm.resetFields();
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
      });
  };
  //Delete a Data
  const handleDelete = (record: any) => {
    // axios
    //   .patch(API_URL + "/" + record._id, { isDeleted: true })
    //   .then((res) => {
    //     console.log(res);
    //     setOpen(false);
    //     setOpenCreate(false);
    //     setRefresh((f) => f + 1);
    //     message.success("Deleted sucessfully!!", 1.5);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

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
    record.updatedBy = auth.payload;
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
      });
  };

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
  const [categoriesName, setCategoriesName] = useState("");

  const onSearchCategoriesName = useCallback((value: any) => {
    if (value) {
      setCategoriesName(value);
    } else {
      setCategoriesName("");
    }
  }, []);

  //SEARCH DEPEN ON DESCRIPTION
  const [categoryDescription, setCategoryDescription] = useState("");

  const onSearchCategoryDescription = (record: any) => {
    if (record) {
      setCategoryDescription(record);
    } else {
      setCategoryDescription("");
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
    categoriesName && `&name=${categoriesName}`,
    categoryDescription && `&description=${categoryDescription}`,
    isActive && `&active=${isActive}`,
    isDelete && `&isDeleted=${isDelete}`,
    skip && `&skip=${skip}`,
  ]
    .filter(Boolean)
    .join("")}&limit=10`;

  useEffect(() => {
    axios
      .get(URL_FILTER)
      .then((res) => {
        setCategoryTEST(res.data.results);
        setPages(res.data.amountResults);
      })
      .catch((err) => console.log(err));
  }, [URL_FILTER, refresh]);

  //Setting column
  const columns = [
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
      width: "11%",
    },
    //Name
    {
      title: () => {
        return (
          <div>
            {categoriesName ? (
              <div className="text-danger">Name</div>
            ) : (
              <div className="secondary">Name</div>
            )}
          </div>
        );
      },
      dataIndex: "name",
      key: "name",
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Search
              allowClear
              placeholder="input search text"
              onSearch={onSearchCategoriesName}
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    //Desciption
    {
      title: () => {
        return (
          <div>
            {categoryDescription ? (
              <div className="text-danger">Description</div>
            ) : (
              <div className="secondary">Description</div>
            )}
          </div>
        );
      },
      dataIndex: "description",
      key: "description",
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Search
              allowClear
              placeholder="input search text"
              onSearch={onSearchCategoryDescription}
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },

    //Note
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: "10%",
    },

    //function
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (text: any, record: any) => (
        <Space>
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
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setOpen(true);
              setUpdateId(record._id);
              updateForm.setFieldsValue(record);
            }}
          ></Button>
        </Space>
      ),
      filterDropdown: () => {
        return (
          <>
            <Space direction="vertical">
              <Button
                style={{ width: "150px" }}
                onClick={() => {
                  setCategoriesName("");
                  setCategoryDescription("");
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
                Add Category
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <div className="container">
      {/* Modal Create A Category */}
      <Modal
        title={`Create Category `}
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
                label="description"
                name="description"
                rules={[
                  { required: true, message: "Please input Description!" },
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
                label="promotionPosition"
                name="promotionPosition"
              >
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="Select promotion"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    {
                      value: "TOP-MONTH",
                      label: "TOP-MONTH",
                    },
                    {
                      value: "DEAL",
                      label: "DEAL",
                    },
                  ]}
                />
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
        dataSource={categoryTEST}
        pagination={false}
        scroll={{ x: "max-content", y: 630 }}
        rowClassName={(record) => {
          if (record.active === false && record.isDeleted === false) {
            return "bg-dark-subtle";
          } else if (record.isDeleted) {
            return "text-danger bg-success-subtle";
          } else {
            return "";
          }
        }}
      />

      {/* Model Update */}
      <Modal
        open={open}
        title="Update Category"
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
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please input Description!" }]}
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
              label="promotionPosition"
              name="promotionPosition"
            >
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="Select promotion"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "TOP-MONTH",
                    label: "TOP-MONTH",
                  },
                  {
                    value: "DEAL",
                    label: "DEAL",
                  },
                ]}
              />
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
              label="sortOrder"
              name="sortOrder"
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

export default CategoryCRUD;
