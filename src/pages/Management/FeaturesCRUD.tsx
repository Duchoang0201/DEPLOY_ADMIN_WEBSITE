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
  Form,
  Input,
  InputNumber,
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
function FeaturesCRUD() {
  //Set File avatar

  const [file, setFile] = useState<any>(null);

  const { auth } = useAuthStore((state: any) => state);

  const [refresh, setRefresh] = useState(0);

  // Date Picker Setting

  dayjs.extend(customParseFormat);

  // API OF COLLECTIOn
  let API_URL = "http://localhost:9000/features";

  // MODAL:
  // Modal open Create:
  const [openCreate, setOpenCreate] = useState(false);

  // Modal open Update:
  const [open, setOpen] = useState(false);

  //Delete Item
  const [deleteItem, setDeleteItem] = useState<any>();

  //For fillter:

  //Data fillter
  const [featuresTEST, setFeaturesTEST] = useState<any>([]);

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
    record.createdBy = auth.payload;
    record.createdDate = new Date().toISOString();
    if (record.active === undefined) {
      record.active = false;
    }

    axios
      .post(API_URL, record)
      .then((res) => {
        // UPLOAD FILE
        const { _id } = res.data.result;

        const formData = new FormData();
        formData.append("file", file);

        axios
          .post(`http://localhost:9000/upload/features/${_id}/image`, formData)
          .then((respose) => {
            message.success("Thêm mới thành công!");
            createForm.resetFields();
            setFile(null);
            setOpenCreate(false);
          });
        setTimeout(() => {
          setRefresh((f) => f + 1);
        }, 4000);
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
    record.updatedBy = auth.payload;
    record.updatedDate = new Date().toISOString();

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

  //SEARCH DEPEN ON TITLE
  const [featureTitle, setFeatureTitle] = useState("");

  const onSearchFeaturesTitle = useCallback((value: any) => {
    console.log(value);
    if (value) {
      setFeatureTitle(value);
    } else {
      setFeatureTitle("");
    }
  }, []);

  //SEARCH DEPEN ON NAME
  const [featureSummary, setFeatureSummary] = useState("");

  const onSearchFeaturesSumary = useCallback((value: any) => {
    console.log(value);
    if (value) {
      setFeatureSummary(value);
    } else {
      setFeatureSummary("");
    }
  }, []);

  //SEARCH DEPEN ON LastName
  const [featureUrl, setFeatureUrl] = useState("");

  const onSearchFeaturesUrl = (record: any) => {
    if (record) {
      setFeatureUrl(record);
    } else {
      setFeatureUrl("");
    }
  };

  //Search on Skip and Limit

  const [pages, setPages] = useState();
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const featureCurrent = (value: any) => {
    setSkip(value * 10 - 10);
    setCurrentPage(value);
  };
  //GET DATA ON FILLTER
  const URL_FILTER = `${API_URL}?${[
    featureTitle && `&email=${featureTitle}`,
    isLocked && `&Locked=${isLocked}`,
    skip && `&skip=${skip}`,
  ]
    .filter(Boolean)
    .join("")}&limit=10`;

  useEffect(() => {
    axios
      .get(URL_FILTER)
      .then((res) => {
        setFeaturesTEST(res.data.results);
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
              {record.active === true && (
                <span style={{ fontSize: "16px", color: "#08c" }}>
                  <CheckCircleOutlined /> Active
                </span>
              )}
              {record.active === false && (
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
                src={"http://localhost:9000" + record.imageUrl}
                style={{ height: 60 }}
                alt="record.imageUrl"
              />
            )}
          </div>
        );
      },
    },
    //Title
    {
      title: () => {
        return (
          <div>
            {featureTitle ? (
              <div className="text-danger">Title</div>
            ) : (
              <div className="secondary">Title</div>
            )}
          </div>
        );
      },
      dataIndex: "title",
      key: "title",
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Search
              allowClear
              onSearch={onSearchFeaturesTitle}
              placeholder="input search text"
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    //Summary
    {
      title: () => {
        return (
          <div>
            {featureSummary ? (
              <div className="text-danger">Summary</div>
            ) : (
              <div className="secondary">Summary</div>
            )}
          </div>
        );
      },
      dataIndex: "summary",
      key: "summary",
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Search
              allowClear
              placeholder="input search text"
              onSearch={onSearchFeaturesSumary}
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },

    //URL
    {
      title: () => {
        return (
          <div>
            {featureUrl ? (
              <div className="text-danger">URL</div>
            ) : (
              <div className="secondary">URL</div>
            )}
          </div>
        );
      },
      dataIndex: "url",
      key: "url",
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Search
              allowClear
              onSearch={onSearchFeaturesUrl}
              placeholder="input search text"
              style={{ width: 200 }}
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
            action={`http://localhost:9000/upload/features/${record._id}/image`}
            headers={{ authorization: "authorization-text" }}
            onChange={(info) => {
              if (info.file.status !== "uploading") {
                console.log(info.file);
              }

              if (info.file.status === "done") {
                message.success(`${info.file.name} file uploaded successfully`);

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
        </Space>
      ),
      filterDropdown: () => {
        return (
          <>
            <Space direction="vertical">
              <Button
                style={{ width: "150px" }}
                onClick={() => {
                  setFeatureTitle("");
                  setFeatureSummary("");
                  onSearchFeaturesUrl("");
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
                Add Features
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {/* Modal Create A Features */}
      <Modal
        title={`Create Features `}
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
            <div className="row">
              <FormItem
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 16,
                }}
                hasFeedback
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please input Title!" }]}
              >
                <Input />
              </FormItem>
              <FormItem
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 16,
                }}
                hasFeedback
                label="Summary"
                name="summary"
                rules={[{ required: true, message: "Please input Summary!" }]}
              >
                <Input />
              </FormItem>
              <FormItem
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 16,
                }}
                hasFeedback
                label="URL"
                name="url"
                rules={[{ required: true, message: "Please input URL!" }]}
              >
                <Input />
              </FormItem>

              <FormItem
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 16,
                }}
                hasFeedback
                label="Sort Oder"
                name="sortOder"
                rules={[{ required: true, message: "Please input Sort Oder!" }]}
              >
                <InputNumber />
              </FormItem>

              <FormItem
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 16,
                }}
                hasFeedback
                label="Active"
                name="active"
                valuePropName="checked"
              >
                <Switch />
              </FormItem>
              <Form.Item
                labelCol={{
                  span: 6,
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
                  span: 6,
                }}
                wrapperCol={{
                  span: 16,
                }}
                label="Hình minh họa"
                name="file"
              >
                <Upload
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
            </div>
          </Form>
        </div>
      </Modal>

      {/* List and function  */}

      <div>
        <Table
          // loading={!featuresTEST ? true : false}
          loading={loadingTable}
          rowKey="_id"
          columns={columns}
          dataSource={featuresTEST}
          pagination={false}
          scroll={{ x: "max-content", y: 610 }}
          rowClassName={(record) => {
            return record.active === false
              ? "text-danger bg-success-subtle"
              : "";
          }}
        />
        <Pagination
          className="container text-end"
          onChange={(e) => featureCurrent(e)}
          defaultCurrent={1}
          total={pages}
        />
      </div>

      {/* Modal confirm Delte */}

      {/* Model Update */}
      <Modal
        open={open}
        title="Update Features"
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
                span: 6,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input Title!" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Summary"
              name="summary"
              rules={[{ required: true, message: "Please input Summary!" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="URL"
              name="url"
              rules={[{ required: true, message: "Please input URL!" }]}
            >
              <Input />
            </FormItem>

            <FormItem
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Sort Oder"
              name="sortOder"
              rules={[{ required: true, message: "Please input Sort Oder!" }]}
            >
              <InputNumber />
            </FormItem>

            <FormItem
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 16,
              }}
              hasFeedback
              label="Active"
              name="active"
              valuePropName="checked"
            >
              <Switch />
            </FormItem>
            <Form.Item
              labelCol={{
                span: 6,
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
    </div>
  );
}

export default FeaturesCRUD;
