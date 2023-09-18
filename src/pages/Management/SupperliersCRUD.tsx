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
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import { axiosClient } from "../../libraries/axiosClient";
import { useEffect, useRef, useState } from "react";
import Search from "antd/es/input/Search";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { handleCustomData } from "../../util/handleCustomData";
import SupplierForm from "../Form/SupplierForm";

import { functionValidate } from "../../validation/FunctionValidate";
import { customeDataValidate } from "../../validation/customDataValidate";

function SupplierCRUD() {
  const customizeData: any = {
    collection: "suppliers",
  };
  const [searchParams] = useSearchParams();
  searchParams.set("limit", "10");

  const timeoutSucess = useRef<any>();
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const { auth } = useAuthStore((state: any) => state);

  const [openCreate, setOpenCreate] = useState(false);

  // Modal open Update:
  const [open, setOpen] = useState(false);

  const [deleteItem, setDeleteItem] = useState<any>();

  const onSearchItem = async (record: any) => {
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

  const {
    data: suppliersData,
    isFetching,

    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getsuppliers"],
    queryFn: () => {
      return axiosClient.get(`/suppliers?${searchParams.toString()}`);
    },
    onError: (err: any) => {},
    retry: false,
  });

  useEffect(() => {}, [isError]);
  const { mutate, isLoading: isMutating } = useMutation(handleCustomData, {
    onSuccess: (data) => {
      if (timeoutSucess.current) {
        clearTimeout(timeoutSucess.current);
      }
      timeoutSucess.current = setTimeout(() => {
        refetch();
      }, 500);
    },
    onSettled(data: any) {
      if (data.ok) {
        message.success("Created Category Sucessfully!!");
        refetch();
      }
      if (data.response?.data?.message) {
        message.error(data.response?.data?.message);
      }
    },
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

    customizeData.data = record;
    mutate(customizeData);

    setOpenCreate(false);
    createForm.resetFields();
  };
  //Delete a Data
  const handleDelete = (record: any) => {
    customizeData.type = "DELETE";
    customizeData.id = record._id;

    console.log(`🚀🚀🚀!..customizeData`, customizeData);
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
                placeholder="Select a supplier"
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
                  console.log(`🚀🚀🚀!..e`, e);
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
      width: "10%",
    },
    //Email
    {
      title: () => {
        return (
          <div>
            {searchParams.get("email") ? (
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
              onSearch={(e: any) => {
                const valueSearch = { type: "email", value: e };
                onSearchItem(valueSearch);
              }}
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
            {searchParams.get("name") ? (
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
                style={{ width: "125px" }}
                placeholder="Select a supplier"
                optionFilterProp="children"
                onSearch={(e: any) => {
                  const valueSearch = { type: "name", value: e };
                  onSearchItem(valueSearch);
                }}
                showSearch
                filterOption={(input: any, option: any) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={suppliersData?.data?.results?.map(
                  (item: any, index: any) => {
                    return {
                      label: `${item.name}`,
                      value: item.name,
                    };
                  }
                )}
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
            {searchParams.get("phoneNumber") ? (
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
            <Input.Search
              step="string"
              allowClear
              placeholder="Enter phone number"
              onSearch={(e: any) => {
                const valueSearch = { type: "phoneNumber", value: e };
                onSearchItem(valueSearch);
              }}
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
            {searchParams.get("address") ? (
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
              onSearch={(e: any) => {
                const valueSearch = { type: "address", value: e };
                onSearchItem(valueSearch);
              }}
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
      {/* Modal Create A Category */}
      <Modal
        title="Create Category"
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
          <SupplierForm />
        </Form>
      </Modal>

      {/* List and function  */}

      <Table
        bordered
        loading={isLoading || isFetching || isMutating}
        rowKey="_id"
        columns={columns}
        dataSource={suppliersData?.data?.results}
        pagination={{
          // pageSize: 10,
          onChange: (e) => {
            slideCurrent(e);
            setCurrentPage(e);
          },
          total: suppliersData?.data?.amountResults,

          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} items`,

          size: "small",
          current: currentPage,
        }}
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
        title="Update Supplier"
        onCancel={() => setOpen(false)}
        onOk={() => {
          updateForm.submit();
        }}
        okType="dashed"
      >
        <Form form={updateForm} name="updateForm" onFinish={handleUpdate}>
          <SupplierForm />
        </Form>
      </Modal>
    </div>
  );
}

export default SupplierCRUD;
