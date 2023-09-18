import {
  CheckCircleOutlined,
  ClearOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Upload,
  InputNumber,
  Card,
  Image,
} from "antd";
import { axiosClient } from "../../libraries/axiosClient";
import { useEffect, useRef, useState } from "react";
import Search from "antd/es/input/Search";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { handleCustomData } from "../../util/handleCustomData";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { functionValidate } from "../../validation/FunctionValidate";
import { customeDataValidate } from "../../validation/customDataValidate";
import { API_URL } from "../../constants/URLS";
import ProductForm from "../Form/ProductForm";
import axios from "axios";
dayjs.extend(customParseFormat);
function ProductCRUD() {
  const customizeData: any = {
    collection: "products",
  };

  const [files, setFiles] = useState<any>(null);
  const [searchParams] = useSearchParams();
  searchParams.set("limit", "10");

  const timeoutSucess = useRef<any>();
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const { auth } = useAuthStore((state: any) => state);

  const [openCreate, setOpenCreate] = useState(false);

  // Modal open Update:
  const [open, setOpen] = useState(false);
  const [openDetailPicture, setOpenDetailPicture] = useState(false);

  const [deleteItem, setDeleteItem] = useState<any>();
  const [updateId, setUpdateId] = useState<any>();

  const onSearchItem = async (record: any) => {
    searchParams.set("limit", "10");
    searchParams.set("skip", "0");
    try {
      if (record.type && record.value) {
        searchParams.set(record.type, record.value);

        const res = await customeDataValidate({
          collection: "Product",
          searchParams,
        });

        const result: any = await functionValidate(res);

        if (result.oke) {
          await refetch();
        } else {
          message.error(result.message);
          searchParams.delete(record.type);
        }
      } else if (
        record.type &&
        (record.value === "" ||
          record.value === undefined ||
          record.value === null)
      ) {
        searchParams.delete(record.type);
        await refetch();
      }
      setCurrentPage(1);
    } catch (error: any) {
      message.error(error.message || error.reponse.data.message);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const slideCurrent = (value: any) => {
    const skipValue = (value - 1) * 10;
    searchParams.set("skip", skipValue.toString());
    refetch();
  };

  /// GET PRODUCTS
  const {
    data: productsData,
    isFetching,

    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["getProducts", files],
    queryFn: () => {
      return axiosClient.get(`/products?${searchParams.toString()}`);
    },
    onError: (err: any) => {},
    retry: false,
  });

  //GET CATEGORIES
  const { data: categoriesData } = useQuery({
    queryKey: ["getCategories"],
    queryFn: () => {
      return axiosClient.get(`/categories`);
    },
    onError: (err: any) => {},
    retry: false,
  });
  //GET SUPPLIERS
  const { data: suppliersData } = useQuery({
    queryKey: ["getSuppliers"],
    queryFn: () => {
      return axiosClient.get(`/suppliers`);
    },
    onError: (err: any) => {},
    retry: false,
  });

  const { mutate, isLoading: isMutating } = useMutation(handleCustomData, {
    onSuccess: (data) => {
      if (timeoutSucess.current) {
        clearTimeout(timeoutSucess.current);
      }
      timeoutSucess.current = setTimeout(() => {
        refetch();
        message.success("Created Customer Sucessfully!!");
      }, 500);
    },
    // onSettled(data: any) {
    //   if (data.ok) {
    //     refetch();
    //     setFiles(null);
    //   }
    //   if (data.response?.data?.message) {
    //     message.error(data.response?.data?.message);
    //   }
    // },
  });

  //Create data
  const handleCreate = async (record: any) => {
    delete record._id;
    record.createdBy = {
      employeeId: auth.payload._id,
      firstName: auth.payload.firstName,
      lastName: auth.payload.lastName,
    };
    record.isDeleted = false;
    record.createdDate = new Date().toISOString();
    if (record.active === undefined) {
      record.active = false;
    }

    customizeData.type = "CREATE";
    customizeData.file = files;

    customizeData.data = record;
    mutate(customizeData);

    setOpenCreate(false);
    createForm.resetFields();
  };
  //Delete a Data
  const handleDelete = (record: any) => {
    customizeData.type = "DELETE";
    customizeData.id = record._id;
    mutate(customizeData);
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
    customizeData.type = "PATCH";
    customizeData.id = record._id;
    customizeData.data = record;
    mutate(customizeData);
    setOpen(false);
  };

  //Setting column
  const columns = [
    //No
    {
      title: () => {
        return (
          <div>
            {searchParams.get("active") || searchParams.get("isDeleted") ? (
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
              {index + 1 + (currentPage - 1) * 10}
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
                  searchParams.delete("active");
                  searchParams.delete("isDeleted");
                  refetch();
                }}
                style={{ width: "125px" }}
                placeholder="Select "
                optionFilterProp="children"
                showSearch
                onChange={(e) => {
                  let searchValue: any = {};
                  if (e === "active") {
                    searchValue.type = "active";
                    searchValue.value = "true";
                  }
                  if (e === "unActive") {
                    searchValue = {};
                    searchValue.type = "active";
                    searchValue.value = "false";
                  }
                  if (e === "isDeleted") {
                    searchValue = {};

                    searchValue.type = "isDeleted";
                    searchValue.value = "true";
                  }
                  onSearchItem(searchValue);
                }}
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
      width: "2%",

      title: "Picture",
      key: "imageUrl",
      dataIndex: "imageUrl",
      render: (text: any, record: any, index: any) => {
        return (
          <div className=" flex flex-row justify-between items-center">
            <div>
              <img
                src={`${API_URL}${record.imageUrl}`}
                style={{ height: 60 }}
                alt="record.imageUrl"
              />
            </div>
            <div>
              <Button
                className="border-none"
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
            {searchParams.get("categoryId") ? (
              <div className="text-danger">Category</div>
            ) : (
              <div className="secondary">Category</div>
            )}
          </div>
        );
      },
      dataIndex: ["category", "name"],
      key: "category",

      filterDropdown: () => {
        return (
          <div style={{ width: "150px" }}>
            <Select
              allowClear
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a product"
              onChange={(e: any) => {
                const valueSearch = { type: "categoryId", value: e };
                onSearchItem(valueSearch);
              }}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              options={categoriesData?.data?.results?.map(
                (item: any, index: any) => ({
                  label: item.name,
                  value: item._id,
                })
              )}
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
            {searchParams.get("supplierId") ? (
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
                style={{ width: "125px" }}
                placeholder="Select a supplier"
                onChange={(e: any) => {
                  const valueSearch = { type: "supplierId", value: e };
                  onSearchItem(valueSearch);
                }}
                showSearch
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase()) >= 0
                }
                options={suppliersData?.data?.results?.map((item: any) => {
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
            {searchParams.get("productName") ? (
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
              onSearch={(e: any) => {
                const valueSearch = { type: "productName", value: e };
                onSearchItem(valueSearch);
              }}
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
            {searchParams.get("fromPrice") || searchParams.get("toPrice") ? (
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
            name="inforPrice"
            onFinish={(e: any) => {
              const valueSearch = [
                { type: "fromPrice", value: e.fromPrice },
                { type: "toPrice", value: e.toPrice },
              ];
              valueSearch?.map((item: any) => onSearchItem(item));
            }}
            className=" px-2 py-2 h-12"
          >
            <Space>
              <Form.Item
                // hasFeedback
                label="from"
                name="fromPrice"
              >
                <InputNumber
                  placeholder="Enter From"
                  min={1}
                  className="w-28"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value: any) =>
                    value!.replace(/\s?d|(\.*)/g, "").replace(/\./g, "")
                  }
                />
              </Form.Item>
              <Form.Item label="to" name="toPrice">
                <InputNumber
                  placeholder="Enter to"
                  min={1}
                  className="w-28"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value: any) =>
                    value!.replace(/\s?d|(\.*)/g, "").replace(/\./g, "")
                  }
                />
              </Form.Item>
              <span>
                <Form.Item>
                  <Button
                    // style={{ width: "30px", right: "-10px" }}
                    type="dashed"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  />
                </Form.Item>
              </span>
              <span>
                {searchParams.get("fromPrice") ||
                searchParams.get("toPrice") ? (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        searchParams.delete("fromPrice");
                        searchParams.delete("toPrice");
                        refetch();
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
            {searchParams.get("fromStock") || searchParams.get("toStock") ? (
              <div className="text-danger">Stock</div>
            ) : (
              <div className="secondary">Stock</div>
            )}
          </div>
        );
      },
      dataIndex: "stock",
      key: "stock",
      render: (text: any, record: any) => {
        return <div>{text}</div>;
      },
      filterDropdown: () => {
        return (
          <Form
            name="infoStock"
            onFinish={(e: any) => {
              const valueSearch = [
                { type: "fromStock", value: e.fromStock },
                { type: "toStock", value: e.toStock },
              ];
              valueSearch.map((item) => onSearchItem(item));
            }}
            className=" px-2 py-2 h-12"
          >
            <Space>
              <Form.Item
                // hasFeedback
                label="from"
                name="fromStock"
              >
                <InputNumber
                  placeholder="Enter From"
                  min={1}
                  className="w-28"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value: any) =>
                    value!.replace(/\s?d|(\.*)/g, "").replace(/\./g, "")
                  }
                />
              </Form.Item>
              <Form.Item label="to" name="toStock">
                <InputNumber
                  placeholder="Enter to"
                  min={1}
                  className="w-28"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value: any) =>
                    value!.replace(/\s?d|(\.*)/g, "").replace(/\./g, "")
                  }
                />
              </Form.Item>
              <span>
                <Form.Item>
                  <Button
                    type="dashed"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  />
                </Form.Item>
              </span>
              <span>
                {searchParams.get("fromStock") ||
                searchParams.get("toStock") ? (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        searchParams.delete("fromStock");
                        searchParams.delete("toStock");
                        refetch();
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
            {searchParams.get("fromDiscount") ||
            searchParams.get("toDiscount") ? (
              <div className="text-danger">Discount</div>
            ) : (
              <div className="secondary">Discount</div>
            )}
          </div>
        );
      },
      dataIndex: "discount",
      key: "discount",
      render: (text: any, record: any) => {
        return <div>{text}</div>;
      },
      filterDropdown: () => {
        return (
          <Form
            name="infoDiscount"
            onFinish={(e: any) => {
              const valueSearch = [
                { type: "fromDiscount", value: e.fromDiscount },
                { type: "toDiscount", value: e.toDiscount },
              ];
              valueSearch.map((item) => onSearchItem(item));
            }}
            className=" px-2 py-2 h-12"
          >
            <Space>
              <Form.Item label="from" name="fromDiscount">
                <InputNumber
                  placeholder="Enter From"
                  min={1}
                  className="w-28"
                />
              </Form.Item>
              <Form.Item label="to" name="toDiscount">
                <InputNumber placeholder="Enter to" min={1} className="w-28" />
              </Form.Item>
              <span>
                <Form.Item>
                  <Button
                    type="dashed"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  />
                </Form.Item>
              </span>
              <span>
                {searchParams.get("fromDiscount") ||
                searchParams.get("toDiscount") ? (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        searchParams.delete("fromDiscount");
                        searchParams.delete("toDiscount");
                        refetch();
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
              updateForm.setFieldsValue(record);
            }}
          />
        </Space>
      ),
      filterDropdown: () => {
        return (
          <>
            <Space direction="vertical">
              <Button
                style={{ width: "150px" }}
                onClick={async () => {
                  const arrValue: any = [];
                  await searchParams.forEach((value, key) => {
                    arrValue.push({ value: "", type: key });
                  });

                  await arrValue.map(async (item: any) => {
                    await onSearchItem(item);
                  });
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
                Add Product
              </Button>
            </Space>
          </>
        );
      },
    },
  ];
  // KEEP UPDATE ID:

  useEffect(() => {
    // Check if the selected order exists in the updated dataResource
    const updatedSelectedOrder = productsData?.data?.results.find(
      (product: any) => product._id === updateId?._id
    );
    setUpdateId(updatedSelectedOrder || null);
  }, [productsData?.data?.results, updateId?._id]);

  // const [fileData, setFileData] = useState<any>({});

  const handleFileUpload = async ({ file }: any) => {
    const loadingMessage = message.loading("Uploading !!", 0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${API_URL}/upload/products/${updateId?._id}/images`,
        formData
      );

      await refetch();
      loadingMessage();
      message.success("Upload Successful", 1.5);
      // You can add further logic to handle the success, such as updating UI or state.
    } catch (error) {
      // Handle any errors here
      console.error("Upload Error", error);
      message.error("Upload Error", 1.5);

      // You can add further logic to handle the error, such as displaying an error message.
    }
  };

  return (
    <div>
      <Modal
        title="Create Customer"
        open={openCreate}
        onCancel={() => {
          setOpenCreate(false);
        }}
        onOk={() => {
          createForm.submit();
        }}
        okType="dashed"
        okText="Submit"
      >
        <Form form={createForm} name="createForm" onFinish={handleCreate}>
          <ProductForm
            props={{
              categoriesData: categoriesData?.data?.results,
              suppliersData: suppliersData?.data?.results,
            }}
          />
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
                setFiles(file);
                return false;
              }}
              onRemove={() => {
                setFiles("");
              }}
            >
              {!files ? (
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
      </Modal>

      {/* List and function  */}

      <Table
        loading={isLoading || isFetching || isMutating}
        rowKey="_id"
        columns={columns}
        dataSource={productsData?.data?.results}
        pagination={{
          onChange: (e) => {
            slideCurrent(e);
            setCurrentPage(e);
          },
          total: productsData?.data?.amountResults,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} items`,

          size: "small",
          current: currentPage,
        }}
        bordered
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
        title="Update Product"
        onCancel={() => setOpen(false)}
        onOk={() => {
          updateForm.submit();
        }}
        okType="dashed"
      >
        <Form form={updateForm} name="updateForm" onFinish={handleUpdate}>
          <ProductForm
            props={{
              categoriesData: categoriesData?.data?.results,
              suppliersData: suppliersData?.data?.results,
            }}
          />
        </Form>
      </Modal>

      <Modal
        open={openDetailPicture}
        onCancel={() => setOpenDetailPicture(false)}
        onOk={() => setOpenDetailPicture(false)}
        okType="default"
      >
        {updateId && (
          <div className="text-center">
            <div className="text-center  py-2 ">
              {updateId && updateId?.name}
            </div>{" "}
            <div className="text-center  py-2 ">Avatar product:</div>{" "}
            <div className="d-flex justify-content-center">
              <Card>
                <Image
                  width={200}
                  height={200}
                  src={`${API_URL}${updateId?.imageUrl}`}
                />
              </Card>
            </div>
            <Upload
              showUploadList={false}
              name="file"
              action={`${API_URL}/upload/products/${updateId?._id}/image`}
              headers={{ authorization: "authorization-text" }}
              onChange={async (info) => {
                console.log(`🚀🚀🚀!..info`, info);

                if (info.file.status === "uploading") {
                  message.loading("On Updating picture on data!!", 1.5);
                }

                if (info.file.response.ok === true) {
                  message.success(" Updating picture on data Okay!!", 1.5);

                  await refetch();
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
              <>
                <Upload
                  multiple
                  customRequest={handleFileUpload}
                  showUploadList={false}
                >
                  <Space
                    className="transition ease-in-out delay-300 w-24 h-24 border-dashed rounded-lg border-2 flex flex-1 justify-center items-center hover:border-slate-500"
                    direction="vertical"
                  >
                    <Button icon={<UploadOutlined />} />
                  </Space>
                </Upload>
                {updateId?.images?.map((item: any, index: any) => {
                  return (
                    <div className="image-container" key={index}>
                      <Image
                        preview={{
                          mask: (
                            <Popconfirm
                              okText="Delete"
                              okType="danger"
                              onCancel={(e) => {
                                e?.stopPropagation();
                              }}
                              onConfirm={(e) => {
                                e?.stopPropagation();
                                const newlistPicture = updateId?.images?.filter(
                                  (field: any) => field !== item
                                );
                                axiosClient
                                  .patch(`/products/${updateId._id}`, {
                                    images: newlistPicture,
                                  })
                                  .then((res) => {
                                    refetch();
                                  })
                                  .catch((err) =>
                                    console.log("error delte image", err)
                                  );
                              }}
                              title={"Are you sure to delete this image?"}
                            >
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="bg-slate-700 font-semibold border-3 rounded shadow hover:border-gray-500"
                                icon={
                                  <DeleteOutlined className="text-red-600" />
                                }
                                title="Delete"
                                type="ghost"
                              />
                            </Popconfirm>
                          ),
                        }}
                        height={100}
                        width={100}
                        src={`${API_URL}/${item}`}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </Space>
        </div>
      </Modal>
    </div>
  );
}

export default ProductCRUD;
