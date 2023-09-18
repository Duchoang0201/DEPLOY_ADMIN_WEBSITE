import {
  EditOutlined,
  RestOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Card,
  Input,
  Col,
  Descriptions,
  Row,
  Divider,
} from "antd";
import { axiosClient } from "../../libraries/axiosClient";
import { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import numeral from "numeral";

import { functionValidate } from "../../validation/FunctionValidate";
import { customeDataValidate } from "../../validation/customDataValidate";
import ProductDrawer from "../../components/Product/ProductDrawer";
dayjs.extend(customParseFormat);
function OrderCRUD() {
  const [searchParams] = useSearchParams();

  // Modal open Update:
  const [selectedOrder, setSelectedOrder] = useState<any>();

  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [shippingAddressDisabled, setShippingAddressDisabled] =
    useState<boolean>(true);
  const [addProducts, setAddProducts] = useState<any>();
  const { data: products } = useQuery({
    queryKey: ["getProduts"],
    queryFn: async () => {
      return await axiosClient.get(`/products?active=true`);
    },
  });
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

  /// GET orders
  const {
    data: ordersData,
    isFetching,

    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["getorders"],
    queryFn: () => {
      return axiosClient.get(`/orders?${searchParams.toString()}`);
    },
    onError: (err: any) => {},
    retry: false,
  });

  //Setting column
  const columns = [
    {
      title: "Order Id",
      dataIndex: "_id",
      key: "_id",
      render: (text: any, record: any) => {
        return <strong>{record._id}</strong>;
      },
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Input.Search
              allowClear
              placeholder="Enter Order Id"
              onSearch={(e) => {
                const searchValue = { type: "orderId", value: e };
                onSearchItem(searchValue);
              }}
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (text: any, record: any) => {
        return (
          <>
            {record.customer?.firstName} {record.customer?.lastName}
          </>
        );
      },
      filterDropdown: () => {
        return (
          <div style={{ width: "150px" }}>
            <Search
              allowClear
              style={{ width: "100%" }}
              placeholder="Select one"
              onSearch={(e) => {
                const searchValue = { type: "firstName", value: e };
                onSearchItem(searchValue);
              }}
            />
          </div>
        );
      },
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
      filterDropdown: () => {
        return (
          <div style={{ width: "150px" }}>
            <Select
              allowClear
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a product"
              optionFilterProp="children"
              onChange={(e) => {
                const searchValue = { type: "methodPay", value: e };
                onSearchItem(searchValue);
              }}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              options={[
                { label: "CASH", value: "CASH" },
                { label: "MOMO", value: "MOMO" },
                { label: "VNPAY", value: "VNPAY" },
              ]}
            />
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text: any, record: any) => {
        return text === "WAITING" ? (
          <div className="">{text}</div>
        ) : text === "ECONFIRMED" ? (
          <div className="text-primary">{text}</div>
        ) : text === "COMPLETED" ? (
          <div className="text-success">{text}</div>
        ) : (
          <div className="text-danger">{text}</div>
        );
      },
      filterDropdown: () => {
        return (
          <div style={{ width: "150px" }}>
            <Select
              allowClear
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a product"
              optionFilterProp="children"
              onChange={(e) => {
                const searchValue = { type: "status", value: e };
                onSearchItem(searchValue);
              }}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              options={[
                { label: "WAITING", value: "WAITING" },
                { label: "ECONFIRMED", value: "ECONFIRMED" },
                { label: "COMPLETED", value: "COMPLETED" },
                { label: "CANCELED", value: "CANCELED" },
              ]}
            />
          </div>
        );
      },
    },
    {
      width: "20%",
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },

    {
      width: "10%",

      title: "Nhân viên",
      dataIndex: "employee",
      key: "employee",
      render: (text: any, record: any) => {
        return (
          <strong>
            {record.employee?.firstName} {record.employee?.lastName}
          </strong>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (text: any, record: any) => {
        const { orderDetails } = record;

        let total = 0;
        orderDetails?.forEach((od: any) => {
          let sum = od.quantity * od.product?.total;
          total = total + sum;
        });

        return (
          <strong>
            {total.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </strong>
        );
      },
    },

    //Function
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (text: any, record: any, index: any) => {
        return (
          <Space>
            <Button
              onClick={() => {
                setSelectedOrder(record);
                setComponentDisabled(true);
              }}
              shape="circle"
              icon={<SearchOutlined />}
            />
            <Popconfirm
              okText="Delete"
              okType="danger"
              onConfirm={async () => {
                const handleCanceled: any = await axiosClient.patch(
                  `/orders/${record._id}`,
                  {
                    status: "CANCELED",
                  }
                );

                if (handleCanceled?.data?._id) {
                  await axiosClient
                    .post(`/orders/orderm/${record._id}/stock`)
                    .then((response) => {
                      refetch();

                      message.success("Hủy đơn hàng thành công !!", 1.5);
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                } else {
                  message.error(`SYSTEM ERROR !!!`);
                }
              }}
              title={"Bạn chắc chắn sẽ hủy đơn hàng?"}
            >
              <Button danger icon={<RestOutlined />}></Button>
            </Popconfirm>
            {record.status === "WAITING" && (
              <Popconfirm
                okText="Confirm"
                okType="danger"
                title={"Are you sure to Confirm it?"}
                onConfirm={async () => {
                  const res = await axiosClient.patch(`/orders/${record._id}`, {
                    status: "ECONFIRMED",
                  });
                  if (res?.data?._id) {
                    message.success(`CONFIRM ORDER'S SUCESSFULLY`);
                    refetch();
                  } else {
                    message.error(`SYSTEM ERROR !!!`);
                  }
                }}
              >
                <Button danger icon={<SendOutlined />}></Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  /// ORDERDETAILS
  const productColumns = [
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text: any, record: any) => (
        <div className="d-flex justify-content-center">
          {" "}
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={async () => {
              const response = await axiosClient.get(
                "orders/" + selectedOrder._id
              );
              const currentOrder = response.data;
              let { orderDetails } = currentOrder;
              const found = orderDetails.find(
                (x: any) => x.productId === record.productId
              );
              if (found) {
                found.quantity += 1;
              } else {
                orderDetails.push({
                  productId: record._id,
                  quantity: 1,
                });
              }

              await axiosClient.patch("orders/" + selectedOrder._id, {
                orderDetails,
              });
              await refetch();
              message.success("Plus a product sucessfully!!", 1.5);
            }}
          >
            +
          </button>
          <div className="border px-4 py-2 text-center align-self-center justify-content-center ">
            {text}
          </div>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={async () => {
              const response = await axiosClient.get(
                "orders/" + selectedOrder._id
              );
              const currentOrder = response.data;
              let { orderDetails } = currentOrder;
              const found = orderDetails.find(
                (x: any) => x.productId === record.productId
              );
              if (found.quantity === 1) {
                orderDetails = orderDetails.filter(
                  (x: any) => x.productId !== record.productId
                );

                await axiosClient.patch("orders/" + selectedOrder._id, {
                  orderDetails,
                });
                refetch();
                message.success(
                  "Remove a product out of order sucessfully!!",
                  1.5
                );
              } else {
                found.quantity -= 1;
                await axiosClient.patch("orders/" + selectedOrder._id, {
                  orderDetails,
                });
                refetch();

                message.success("Minus a product sucessfully!!", 1.5);
              }
            }}
          >
            -
          </button>
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product.name",
      key: "product.name",
      render: (text: any, record: any) => {
        return <strong>{record?.product?.name}</strong>;
      },
    },
    {
      title: "Giá",
      dataIndex: "product.price",
      key: "product.price",
      render: (text: any, record: any) => {
        return (
          <div style={{ textAlign: "right" }}>
            {numeral(record?.product?.price).format("0,0$")}
          </div>
        );
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "product.discount",
      key: "product.discount",
      render: (text: any, record: any) => {
        return (
          <div style={{ textAlign: "right" }}>
            {numeral(record?.product?.discount).format("0,0")}%
          </div>
        );
      },
    },
    {
      title: "",
      key: "actions",
      render: (text: any, record: any, index: any) => {
        const handleDeleteClick = () => {
          // handleDelete(record, index);
        };

        return (
          <>
            <div>
              <Button danger type="dashed" onClick={handleDeleteClick}>
                Delete
              </Button>
            </div>
          </>
        );
      },
    },
  ];
  // KEEP UPDATE ID:

  useEffect(() => {
    // Check if the selected order exists in the updated dataResource
    const updatedSelectedOrder = ordersData?.data?.results?.find(
      (order: any) => order._id === selectedOrder?._id
    );
    setSelectedOrder(updatedSelectedOrder || null);
  }, [ordersData?.data?.results, selectedOrder]);

  return (
    <div>
      <Table
        loading={isLoading || isFetching}
        rowKey="_id"
        columns={columns}
        dataSource={ordersData?.data?.results}
        pagination={{
          // pageSize: 10,
          onChange: (e) => {
            slideCurrent(e);
            setCurrentPage(e);
          },
          total: ordersData?.data?.amountResults,
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

      {/* ORDER DETAIL  */}
      <Modal
        width={"100%"}
        onCancel={() => {
          setSelectedOrder(null);
        }}
        onOk={() => {
          setSelectedOrder(null);
        }}
        okType="dashed"
        open={selectedOrder}
      >
        <Col>
          {selectedOrder && (
            <Card title="Order Detail">
              <div>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Status">
                    <Space>
                      <Space.Compact style={{ width: "100%" }}>
                        <Select
                          disabled={componentDisabled}
                          allowClear
                          showSearch
                          value={selectedOrder.status}
                          style={{ width: "100%" }}
                          optionFilterProp="children"
                          onChange={async (e) => {
                            message.loading("Changing status !!", 1.5);
                            const req = await axiosClient.patch(
                              `/orders/${selectedOrder._id}`,
                              {
                                status: e,
                              }
                            );
                            if (req.data) {
                              message.success(
                                `Change status to ${req.data.status} successfully!!`,
                                1.5
                              );
                              refetch();
                            }
                          }}
                          filterOption={(input: any, option: any) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          options={[
                            { label: "WAITING", value: "WAITING" },
                            { label: "ECONFIRMED", value: "ECONFIRMED" },
                            { label: "COMPLETED", value: "COMPLETED" },
                            { label: "CANCELED", value: "CANCELED" },
                          ]}
                        />
                      </Space.Compact>

                      <Button
                        danger={!componentDisabled}
                        type="dashed"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setComponentDisabled(!componentDisabled);
                        }}
                      />
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Customer">
                    <Space>
                      <Space.Compact style={{ width: "100%" }}>
                        <Input
                          disabled={true}
                          placeholder={`${selectedOrder.customer?.firstName}${selectedOrder.customer?.lastName}`}
                        />
                      </Space.Compact>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Employee">
                    <Space>
                      <Space.Compact style={{ width: "100%" }}>
                        <Input
                          disabled={true}
                          placeholder={`${selectedOrder.employee?.firstName} ${selectedOrder.employee?.lastName}`}
                        />
                      </Space.Compact>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Shipping address">
                    <Row gutter={10} className="py-2">
                      <Col span={20}>
                        <Input.Search
                          disabled={shippingAddressDisabled}
                          enterButton={<SendOutlined />}
                          placeholder={selectedOrder?.shippingAddress}
                          style={{ width: "100%" }}
                          onSearch={async (e) => {
                            message.loading(
                              "Changing Shipping Address !!",
                              1.5
                            );
                            const req = await axiosClient.patch(
                              `/orders/${selectedOrder._id}`,
                              {
                                shippingAddress: e,
                              }
                            );
                            if (req.data) {
                              message.success(
                                `Change Shipping address to ${req.data.status} successfully!!`,
                                1.5
                              );
                              // setRefresh((f) => f + 1);
                              refetch();

                              setShippingAddressDisabled(
                                !shippingAddressDisabled
                              );
                            }
                          }}
                        />
                      </Col>

                      <Col span={4}>
                        <Button
                          danger={!shippingAddressDisabled}
                          type="dashed"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setShippingAddressDisabled(
                              !shippingAddressDisabled
                            );
                          }}
                        />
                      </Col>
                    </Row>
                  </Descriptions.Item>
                </Descriptions>
                <Divider />

                {/* Table include product of orderDetails */}
                <Table
                  bordered
                  scroll={{ x: 200 }}
                  rowKey="_id"
                  dataSource={selectedOrder.orderDetails}
                  columns={productColumns}
                />

                <Button
                  onClick={() => {
                    setAddProducts(true);
                  }}
                >
                  Thêm sản phẩm
                </Button>
              </div>
            </Card>
          )}
        </Col>
      </Modal>

      {/* Modal add product */}

      <ProductDrawer
        products={products?.data?.results}
        addProducts={addProducts}
        setAddProducts={setAddProducts}
        selectedOrder={selectedOrder}
        refetch={refetch}
      />
    </div>
  );
}

export default OrderCRUD;
