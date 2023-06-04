import {
  CheckCircleOutlined,
  ClearOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
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
  Image,
  Upload,
} from "antd";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import Search from "antd/es/input/Search";
import { useAuthStore } from "../../hooks/useAuthStore";

interface ISupplier {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

function ProductsCRUD() {
  const URL_ENV = process.env.REACT_APP_BASE_URL || "http://localhost:9000";

  const [refresh, setRefresh] = useState(0);
  const { auth } = useAuthStore((state: any) => state);
  const [openDetailPicture, setOpenDetailPicture] = useState(false);
  const [categories, setCategories] = useState<any>([]);
  const [suppliers, setSuppliers] = useState([]);

  const [file, setFile] = useState<any>();

  let API_URL = `${URL_ENV}/products`;

  // MODAL:
  // Modal open Create:
  const [openCreate, setOpenCreate] = useState(false);

  // Modal open Update:
  const [open, setOpen] = useState(false);

  //Delete Item
  const [deleteItem, setDeleteItem] = useState<ISupplier>();

  //For fillter:

  //Data fillter
  const [productsTEST, setProductsTEST] = useState<Array<any>>([]);

  // Change fillter (f=> f+1)
  // const [supplierFilter, setSupplierFilter] = useState(API_URL);

  const [updateId, setUpdateId] = useState<any>();

  //Create, Update Form setting
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [inforPrice] = Form.useForm();
  const [inforDiscount] = Form.useForm();
  const [inforStock] = Form.useForm();

  //TableLoading

  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingTable(false);
    }, 1000); // 5000 milliseconds = 5 seconds

    //CATEGORY
    axios
      .get(`${URL_ENV}/categories`)
      .then((res) => {
        setCategories(res.data.results);
      })
      .catch((err) => console.log(err));
    ///SUPPLIER
    axios
      .get(`${URL_ENV}/suppliers`)
      .then((res) => {
        setSuppliers(res.data.results);
      })
      .catch((err) => console.log(err));
  }, [URL_ENV]);

  //Text of Tyography:

  //Handle Create a Data
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
        // UPLOAD FILE
        if (file) {
          const { _id } = res.data.result;

          const formData = new FormData();
          formData.append("file", file);

          axios
            .post(`${URL_ENV}/upload/products/${_id}/image`, formData)
            .then((respose) => {
              message.success("Create a product successFully!!", 1.5);
              createForm.resetFields();
              setRefresh((f) => f + 1);
              setOpen(false);
              setFile(null);
            })
            .catch((err) => {
              message.error("Upload file bị lỗi!");
            });
        } else {
          message.success("Create a product successFully!!", 1.5);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  //handle Delete Data
  const handleDelete = useCallback(
    (record: any) => {
      axios
        .delete(API_URL + "/" + record._id)
        .then((res) => {
          setRefresh((f) => f + 1);
          message.success("Delete a product successFully!!", 3);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [API_URL]
  );

  //Update a data
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
      .patch(API_URL + "/" + updateId._id, record)
      .then((res) => {
        setRefresh((f) => f + 1);
        message.success(`Update product ${record.name} successFully!!`, 3);
        setOpen(false);
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };

  //SEARCH ISDELETE ITEM

  // KEEP UPDATE ID:

  useEffect(() => {
    // Check if the selected order exists in the updated dataResource
    const updatedSelectedOrder = productsTEST.find(
      (product: any) => product._id === updateId?._id
    );
    setUpdateId(updatedSelectedOrder || null);
  }, [productsTEST, updateId]);

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

  //Search on CategoryID
  const [categoryId, setCategoryId] = useState("");

  const onSearchCategory = useMemo(() => {
    return (value: any) => {
      if (value) {
        setCategoryId(value);
      } else {
        setCategoryId("");
      }
    };
  }, []);

  //Search on SupplierID
  const [supplierId, setSupplierId] = useState("");
  const onSearchSupplier = useMemo(() => {
    return (value: any) => {
      if (value) {
        setSupplierId(value);
      } else {
        setSupplierId("");
      }
    };
  }, []);

  //SEARCH DEPEN ON NAME
  const [productName, setProductName] = useState("");

  const onSearchProductName = useMemo(() => {
    return (record: any) => {
      setProductName(record);
    };
  }, []);

  //Search on Price

  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");

  const submitSearchPrice = useMemo(() => {
    return (value: any) => {
      setFromPrice(value.fromPrice ? value.fromPrice : "");
      setToPrice(value.toPrice ? value.toPrice : "");
    };
  }, []);
  //Search on Discount

  const [fromDiscount, setFromDiscount] = useState("");
  const [toDiscount, setToDiscount] = useState("");

  const submitSearchDiscount = useMemo(() => {
    return (value: any) => {
      setFromDiscount(value.fromDiscount ? value.fromDiscount : "");
      setToDiscount(value.toDiscount ? value.toDiscount : "");
    };
  }, []);

  //Search on Stock

  const [fromStock, setFromStock] = useState("");
  const [toStock, setToStock] = useState("");

  const submitSearchStock = useMemo(() => {
    return (value: any) => {
      setFromStock(value.fromStock ? value.fromStock : "");
      setToStock(value.toStock ? value.toStock : "");
    };
  }, []);
  //Search on Skip and Limit

  const [pages, setPages] = useState();
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const slideCurrent = (value: any) => {
    setSkip(value * 10 - 10);
    setCurrentPage(value);
  };
  //Clear fillter
  const handleClearFillter = () => {
    setSupplierId("");
    setProductName("");
    setCategoryId("");
    //Price
    setFromPrice("");
    setToPrice("");
    inforPrice.resetFields();
    //Discount
    setFromDiscount("");
    setToDiscount("");
    inforDiscount.resetFields();
    //Stock
    setFromStock("");
    setToStock("");
    inforStock.resetFields();
    setIsActive("");
    setIsDelete("");
  };
  //GET DATA ON FILLTER
  const queryParams = [
    productName && `productName=${productName}`,
    supplierId && `supplierId=${supplierId}`,
    categoryId && `categoryId=${categoryId}`,
    fromPrice && `fromPrice=${fromPrice}`,
    toPrice && `toPrice=${toPrice}`,
    fromDiscount && `fromDiscount=${fromDiscount}`,
    toDiscount && `toDiscount=${toDiscount}`,
    fromStock && `fromStock=${fromStock}`,
    toStock && `toStock=${toStock}`,
    skip && `skip=${skip}`,
    isActive && `active=${isActive}`,
    isDelete && `isDeleted=${isDelete}`,
  ]
    .filter(Boolean)
    .join("&");

  let URL_FILTER = `${URL_ENV}/products?${queryParams}&limit=10`;
  // CALL API FILTER PRODUCT DEPEND ON QUERY
  useEffect(() => {
    axios
      .get(URL_FILTER)
      .then((res) => {
        setProductsTEST(res.data.results);
        setPages(res.data.amountResults);
      })
      .catch((err) => console.log(err));
  }, [refresh, URL_FILTER]);

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
      width: "1%",
    },
    //IMAGE
    {
      width: "1%",

      title: "Picture",
      key: "imageUrl",
      dataIndex: "imageUrl",
      render: (text: any, record: any, index: any) => {
        return (
          <div>
            <div className="d-flex justify-content-between">
              <img
                src={`${URL_ENV}${record.imageUrl}`}
                style={{ height: 60 }}
                alt="record.imageUrl"
              />
              <Button
                onClick={() => {
                  setUpdateId(record);
                  setOpenDetailPicture(true);
                }}
                icon={<UnorderedListOutlined />}
              />
            </div>
          </div>
        );
      },
    },
    //Category
    {
      width: "1%",

      title: () => {
        return (
          <div>
            {categoryId ? (
              <div className="text-danger">Category</div>
            ) : (
              <div className="secondary">Category</div>
            )}
          </div>
        );
      },
      dataIndex: ["category", "name"],
      key: "category",

      filterDropdown: (clearFilters: any) => {
        return (
          <div style={{ width: "150px" }}>
            <Select
              allowClear
              autoClearSearchValue={!categoryId ? true : false}
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a product"
              optionFilterProp="children"
              onChange={onSearchCategory}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              options={categories.map((item: any, index: any) => ({
                label: item.name,
                value: item._id,
              }))}
            />
          </div>
        );
      },
    },
    //Supplier
    {
      width: "1%",

      title: () => {
        return (
          <div>
            {supplierId ? (
              <div className="text-danger">Supplier</div>
            ) : (
              <div className="secondary">Supplier</div>
            )}
          </div>
        );
      },
      dataIndex: ["supplier", "name"],
      key: "supplier",
      filterDropdown: () => {
        return (
          <>
            <div>
              <Select
                allowClear
                onClear={() => {
                  setSupplierId("");
                }}
                style={{ width: "125px" }}
                placeholder="Select a supplier"
                optionFilterProp="children"
                onChange={onSearchSupplier}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={suppliers.map((item: any, index: any) => {
                  return {
                    label: `${item.name}`,
                    value: item._id,
                  };
                })}
              />
            </div>
          </>
        );
      },
      render: (text: string, record: any) => {
        return <span>{record.supplier?.name}</span>;
      },
      height: "auto",
    },
    //Name
    {
      width: "5%",

      title: () => {
        return (
          <div>
            {productName ? (
              <div className="text-danger">Product Name</div>
            ) : (
              <div className="secondary">Product Name</div>
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
              onSearch={onSearchProductName}
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    //Price
    {
      width: "1%",

      title: () => {
        return (
          <div>
            {fromPrice || toPrice ? (
              <div className="text-danger">Price</div>
            ) : (
              <div className="secondary">Price</div>
            )}
          </div>
        );
      },
      dataIndex: "price",
      key: "price",
      render: (text: any, record: any) => {
        const formattedPrice = text.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        return <div>{formattedPrice}</div>;
      },
      filterDropdown: () => {
        return (
          <Form
            form={inforPrice}
            name="inforPrice"
            onFinish={submitSearchPrice}
            style={{
              padding: "5px",
              width: fromPrice || toPrice ? "350px" : "300px",
              height: "50px",
            }}
          >
            <Space>
              <Form.Item hasFeedback label="from" name="fromPrice">
                <InputNumber placeholder="Enter From" min={1} />
              </Form.Item>
              <Form.Item hasFeedback label="to" name="toPrice">
                <InputNumber placeholder="Enter to" min={1} />
              </Form.Item>
              <span>
                <Form.Item>
                  <Button
                    style={{ width: "30px", right: "-10px" }}
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  />
                </Form.Item>
              </span>
              <span>
                {fromPrice || toPrice ? (
                  <Form.Item>
                    <Button
                      style={{ width: "30px", right: "-8px" }}
                      type="primary"
                      onClick={() => {
                        // setFromPrice("");
                        // setToPrice("");
                        inforPrice.resetFields();
                      }}
                      icon={<ClearOutlined />}
                    />
                  </Form.Item>
                ) : (
                  ""
                )}
              </span>
            </Space>
          </Form>
        );
      },
    },

    //Stock
    {
      width: "1%",

      title: () => {
        return (
          <div>
            {fromStock || toStock ? (
              <div className="text-danger">Stock</div>
            ) : (
              <div className="secondary">Stock</div>
            )}
          </div>
        );
      },
      dataIndex: "stock",
      key: "stock",
      filterDropdown: () => {
        return (
          <Form
            form={inforStock}
            name="inforStock"
            onFinish={submitSearchStock}
            style={{
              padding: "5px",
              width: fromStock || toStock ? "350px" : "300px",
              height: "50px",
            }}
          >
            <Space>
              <Form.Item hasFeedback label="from" name="fromStock">
                <InputNumber min={1} placeholder="Enter From" />
              </Form.Item>
              <Form.Item hasFeedback label="to" name="toStock">
                <InputNumber min={1} placeholder="Enter To" />
              </Form.Item>
              <span style={{ width: "20%" }}>
                <Form.Item>
                  <Button
                    style={{ width: "30px", right: "-4px" }}
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  />
                </Form.Item>
              </span>
              <span>
                {fromStock || toStock ? (
                  <Form.Item>
                    <Button
                      style={{ width: "30px", right: "-8px" }}
                      type="primary"
                      onClick={() => {
                        setFromStock("");
                        setToStock("");
                        inforStock.resetFields();
                      }}
                      icon={<ClearOutlined />}
                    />
                  </Form.Item>
                ) : (
                  ""
                )}
              </span>
            </Space>
          </Form>
        );
      },
    },
    //Discount
    {
      width: "2%",

      title: () => {
        return (
          <div>
            {fromDiscount || toDiscount ? (
              <div className="text-danger">Discount</div>
            ) : (
              <div className="secondary">Discount</div>
            )}
          </div>
        );
      },
      dataIndex: "discount",
      key: "discount",
      filterDropdown: () => {
        return (
          <Form
            form={inforDiscount}
            name="inforDiscount"
            onFinish={submitSearchDiscount}
            style={{
              padding: "5px",
              width: fromDiscount || toDiscount ? "350px" : "300px",
              height: "50px",
            }}
          >
            <Space>
              <Form.Item hasFeedback label="from" name="fromDiscount">
                <InputNumber placeholder="Enter From" min={1} />
              </Form.Item>
              <Form.Item hasFeedback label="to" name="toDiscount">
                <InputNumber placeholder="Enter To" min={1} />
              </Form.Item>
              <span style={{ width: "20%" }}>
                <Form.Item>
                  <Button
                    style={{ width: "30px", right: "-10px" }}
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  />
                </Form.Item>
              </span>
              <span>
                {fromDiscount || toDiscount ? (
                  <Form.Item>
                    <Button
                      style={{ width: "30px", right: "-8px" }}
                      type="primary"
                      onClick={() => {
                        setFromDiscount("");
                        setToDiscount("");
                        inforDiscount.resetFields();
                      }}
                      icon={<ClearOutlined />}
                    />
                  </Form.Item>
                ) : (
                  ""
                )}
              </span>
            </Space>
          </Form>
        );
      },
    },
    //Note

    { title: "Note", dataIndex: "note", key: "note", width: "1%" },

    //Function
    {
      width: "1%",

      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (text: string, record: any) => (
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
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => {
              setOpen(true);
              setUpdateId(record);
              updateForm.setFieldsValue(record);
            }}
          />
          <Upload
            showUploadList={false}
            name="file"
            action={`${URL_ENV}/upload/products/${record._id}/images`}
            headers={{ authorization: "authorization-text" }}
            onChange={(info) => {
              if (info.file.status !== "uploading") {
                console.log(info.file);
              }

              if (info.file.status === "done") {
                message.success(`${info.file.name} file uploaded successfully`);

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
        </Space>
      ),
      filterDropdown: () => {
        return (
          <>
            <Space direction="vertical">
              <Button
                style={{ width: "150px" }}
                onClick={handleClearFillter}
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
                Add Product
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      {/* Modal Create A product */}
      <Modal
        title={`Create Product `}
        open={openCreate}
        onCancel={() => {
          setOpenCreate(false);
        }}
        onOk={() => {
          createForm.submit();
          setRefresh((f) => f + 1);
        }}
        okText="Submit"
      >
        <Form
          className="container px-5"
          form={createForm}
          name="createForm"
          onFinish={handleCreate}
        >
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="Category"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Please enter Category Name",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onSearch={onSearchCategory}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={categories.map((item: any, index: any) => {
                return {
                  label: `${item.name}`,
                  value: item._id,
                };
              })}
            />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="Suppliers"
            name="supplierId"
            rules={[
              {
                required: true,
                message: "Please enter Category Name",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onSearch={onSearchCategory}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={suppliers.map((item: any, index: any) => {
                return {
                  label: `${item.name}`,
                  value: item._id,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter Product Name",
              },
            ]}
          >
            <Input />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter Price" }]}
          >
            <InputNumber style={{ width: 150 }} min={1} />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            name="discount"
            label="Discount"
            rules={[
              {
                required: true,
                message: "Please enter Discount",
              },
            ]}
          >
            <InputNumber min={1} max={75} />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Please enter Stock" }]}
          >
            <InputNumber min={1} />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
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
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="PromotionPosition"
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
          </Form.Item>
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
            label="Hình minh họa"
            name="file"
          >
            <Upload
              showUploadList={true}
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {/* List and function Product */}
      <Table
        loading={loadingTable}
        tableLayout="auto"
        rowKey="id"
        columns={columns}
        dataSource={productsTEST}
        pagination={false}
        scroll={{ x: "max-content", y: 600 }}
        rowClassName={(record) => {
          if (record.active === false && record.isDeleted === false) {
            return "bg-dark-subtle";
          } else if (record.isDeleted) {
            return "text-danger bg-success-subtle";
          } else {
            return "";
          }
        }}
        // dataSource={filterOn ? suppliersFilter : products}
      >
        {" "}
      </Table>

      {/* Modal Update */}
      <Modal
        title={`Update Product:  `}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          updateForm.submit();
          setRefresh((f) => f + 1);
        }}
      >
        <Form
          className="container px-5"
          form={updateForm}
          name="updateForm"
          onFinish={handleUpdate}
        >
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="Category"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Please enter Category Name",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={categories.map((item: any, index: any) => {
                return {
                  label: `${item.name}`,
                  value: item._id,
                };
              })}
            />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="Suppliers"
            name="supplierId"
            rules={[
              {
                required: true,
                message: "Please enter Category Name",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={suppliers.map((item: any, index: any) => {
                return {
                  label: `${item.name}`,
                  value: item._id,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter Product Name",
              },
            ]}
          >
            <Input />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter Price" }]}
          >
            <InputNumber style={{ width: 150 }} min={1} />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            name="discount"
            label="Discount"
            rules={[
              {
                required: true,
                message: "Please enter Discount",
              },
            ]}
          >
            <InputNumber min={1} max={75} />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Please enter Stock" }]}
          >
            <InputNumber min={1} />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
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
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="PromotionPosition"
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
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 8,
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
        </Form>
      </Modal>

      {/* Model Detail Picture */}

      <Modal
        open={openDetailPicture}
        onCancel={() => setOpenDetailPicture(false)}
        onOk={() => setOpenDetailPicture(false)}
      >
        {updateId && (
          <div className="text-center">
            <div className="text-center  py-2 ">
              {updateId && updateId?.name}
            </div>{" "}
            <div className="text-center  py-2 ">Avatar product:</div>{" "}
            <div className="d-flex justify-content-center">
              {" "}
              <Card>
                {" "}
                <Image
                  width={200}
                  height={200}
                  src={`${URL_ENV}${updateId?.imageUrl}`}
                />
              </Card>
            </div>
            <Upload
              showUploadList={false}
              name="file"
              action={`${URL_ENV}/upload/products/${updateId?._id}/image`}
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
              <Button icon={<EditOutlined />} />
            </Upload>
          </div>
        )}
        <div className="listofproduct py-2">
          <div className="py-2">List of picture: </div>
          <Space>
            {updateId && (
              <Upload
                name="file"
                action={`${URL_ENV}/upload/products/${updateId?._id}/images`}
                listType="picture-card"
                fileList={updateId?.images?.map((item: any, index: any) => ({
                  uid: `${-index}`,
                  name: `image${index}.png`,
                  status: "done",
                  url: `${URL_ENV}${item}`,
                }))}
                onChange={(record: any) => {
                  console.log("««««« record »»»»»", record);
                  if (record.file.status !== "uploading") {
                    message.loading("On Updating picture on data!!", 1.5);
                  }
                  if (record.file.status === "uploading") {
                    message.loading("On Updating picture on data!!", 1.5);

                    updateId?.images?.push({ images: record.file.url });

                    setTimeout(() => {
                      setRefresh((f) => f + 1);
                      message.success(
                        `${record.file.name} file uploaded successfully`
                      );
                    }, 2500);
                  } else if (record.file.status === "removed") {
                    const newlistPicture = updateId?.images?.filter(
                      (item: any) => `${URL_ENV}${item}` !== record.file.url
                    );
                    axios
                      .patch(API_URL + "/" + updateId._id, {
                        images: newlistPicture,
                      })
                      .then((res) => {
                        setTimeout(() => {
                          setRefresh(refresh + 1);
                          message.success(
                            `Delete Picture product successfully!!`,
                            3
                          );
                        }, 1000);
                      });
                  } else if (record.file.status === "error") {
                    message.error(`${record.file.name} file upload failed.`);
                  }

                  setTimeout(() => {
                    // console.log("««««« record »»»»»", record.file.status);
                  }, 2000);
                }}
              >
                {updateId?.images?.length >= 5 ? null : <UploadOutlined />}
              </Upload>
            )}
          </Space>
        </div>
      </Modal>

      {/* Pagination */}
      <Pagination
        className="py-4 container text-end "
        onChange={(e) => slideCurrent(e)}
        defaultCurrent={1}
        total={pages}
      />
    </>
  );
}

export default ProductsCRUD;
