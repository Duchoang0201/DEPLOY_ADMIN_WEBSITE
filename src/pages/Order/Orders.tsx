import { useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  Button,
  Card,
  Modal,
  Descriptions,
  Divider,
  Row,
  Col,
  Select,
  Space,
  Popconfirm,
  message,
  Pagination,
  Input,
} from "antd";
import numeral from "numeral";
import axios from "axios";
import { axiosClient } from "../../libraries/axiosClient";
import {
  EditOutlined,
  RestOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons";

export default function Orders() {
  const URL_ENV = process.env.REACT_APP_BASE_URL || "http://localhost:9000";
  let API_URL = `${URL_ENV}/orders`;

  const [refresh, setRefresh] = useState(0);
  const [addProductsModalVisible, setAddProductsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [shippingAddressDisabled, setShippingAddressDisabled] =
    useState<boolean>(true);
  const handleDelete = async (record: any, index: any) => {
    const currentProduct = record;
    const response = await axiosClient.get("orders/" + selectedOrder._id);
    const currentOrder = response.data;
    const { orderDetails } = currentOrder;
    const remainOrderDetails = orderDetails.filter((x: any) => {
      return x.productId.toString() !== currentProduct.productId.toString();
    });
    await axiosClient.patch("orders/" + selectedOrder._id, {
      orderDetails: remainOrderDetails,
    });
    setRefresh((f) => f + 1);
    message.success(
      `Delete product: ${record.product.name} successfully!!!`,
      1.5
    );
  };

  //Seach Order by Id
  const [orderId, setOrderId] = useState("");

  const onSearchOrderId = useMemo(() => {
    return (record: any) => {
      setOrderId(record);
    };
  }, []);
  //SEARCH CUSTOMER
  const [customerId, setCustomerId] = useState("");

  const onSearchCustomerName = useMemo(() => {
    return (record: any) => {
      if (record) {
        setCustomerId(record);
      } else {
        setCustomerId("");
      }
    };
  }, []);

  //SEARCH METHOD PAY

  const [methodPay, setMethodPay] = useState("");

  const onSearchMethodPay = useMemo(() => {
    return (record: any) => {
      if (record) {
        setMethodPay(record);
      } else {
        setMethodPay("");
      }
    };
  }, []);

  //SEARCH METHOD PAY

  const [status, setStatus] = useState("");

  const onSearchStatus = useMemo(() => {
    return (record: any) => {
      if (record) {
        setStatus(record);
      } else {
        setStatus("");
      }
    };
  }, []);

  const [pages, setPages] = useState();
  const [skip, setSkip] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);
  const slideCurrent = (value: any) => {
    setSkip(value * 10 - 10);
    // setCurrentPage(value);
  };

  // Products
  const [products, setProducts] = useState<any>([]);
  const [skipProducts, setSkipProducts] = useState(0);
  // const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const [pageProducts, setPageProduts] = useState();
  const slideCurrentProduct = (value: any) => {
    setSkipProducts(value * 10 - 10);
    // setCurrentPageProducts(value);
  };
  const queryParams = [skipProducts && `skip=${skipProducts}`]
    .filter(Boolean)
    .join("&");

  let URL_FILTER_PRODUCTS = `${URL_ENV}/products?${queryParams}&limit=10`;
  // CALL API FILTER PRODUCT DEPEND ON QUERY
  useEffect(() => {
    axios
      .get(URL_FILTER_PRODUCTS)
      .then((res) => {
        setProducts(res.data.results);
        setPageProduts(res.data.amountResults);
      })
      .catch((err) => console.log(err));
  }, [refresh, URL_FILTER_PRODUCTS]);

  const URL_FILTER = `${API_URL}?${[
    customerId && `&customerId=${customerId}`,
    methodPay && `&methodPay=${methodPay}`,
    status && `&status=${status}`,
    orderId && `&orderId=${orderId}`,
    skip && `&skip=${skip}`,
  ]
    .filter(Boolean)
    .join("")}&limit=10`;

  //GET ORDER
  const [orders, setOrders] = useState<any>([]);

  const listCustomerRef = useRef<any>(null);

  if (orders.length > 0 && !listCustomerRef.current) {
    listCustomerRef.current = orders;
  }

  const listCustomer = listCustomerRef.current;

  // Create an array of merged items

  useEffect(() => {
    axios.get(URL_FILTER).then((response) => {
      setOrders(response.data.results);
      setPages(response.data.amountResults);
    });
  }, [URL_FILTER, refresh]);

  useEffect(() => {
    // Check if the selected order exists in the updated dataResource
    const updatedSelectedOrder = orders.find(
      (order: any) => order._id === selectedOrder?._id
    );
    setSelectedOrder(updatedSelectedOrder || null);
  }, [orders, selectedOrder]);

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
              setRefresh((f) => f + 1);
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
                setRefresh((f) => f + 1);
                message.success(
                  "Remove a product out of order sucessfully!!",
                  1.5
                );
              } else {
                found.quantity -= 1;
                await axiosClient.patch("orders/" + selectedOrder._id, {
                  orderDetails,
                });
                setRefresh((f) => f + 1);
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
          handleDelete(record, index);
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

  // Orders
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
              onSearch={onSearchOrderId}
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
        /// GET LIST OF CUSTOMERID
        // Create a map to store merged items
        const mergedMap = new Map();

        // Iterate over the orders array
        listCustomer?.forEach((item: any) => {
          const value = item?.customer?._id;
          const label = `${item.customer?.firstName} ${item.customer?.lastName}`;

          // If the value doesn't exist in the map, add it with the label
          if (!mergedMap.has(value)) {
            mergedMap.set(value, { value, label });
          }
        });
        let mergedOrders = Array.from(mergedMap.values());

        return (
          <div style={{ width: "150px" }}>
            <Select
              allowClear
              showSearch
              style={{ width: "100%" }}
              placeholder="Select one"
              optionFilterProp="children"
              onChange={onSearchCustomerName}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              options={mergedOrders}
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
              onChange={onSearchMethodPay}
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
              onChange={onSearchStatus}
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
        orderDetails.forEach((od: any) => {
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
                const handleCanceled: any = await axios.patch(
                  `${URL_ENV}/orders/${record._id}`,
                  {
                    status: "CANCELED",
                  }
                );

                if (handleCanceled?.data?._id) {
                  await axios
                    .post(`${URL_ENV}/products/orderm/${record._id}/stock`)
                    .then((response) => {
                      setTimeout(() => {
                        setRefresh((f) => f + 1);
                        message.success("Hủy đơn hàng thành công !!", 1.5);
                      }, 2000);
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
                  const res = await axios.patch(
                    `${URL_ENV}/orders/${record._id}`,
                    {
                      status: "ECONFIRMED",
                    }
                  );
                  if (res?.data?._id) {
                    message.success(`CONFIRM ORDER'S SUCESSFULLY`);
                    setRefresh((f) => f + 1);
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

  return (
    <div style={{ overflow: "scroll", maxHeight: "100vh" }}>
      {/* Modal specific orders */}

      {/* Modal add product */}
      <Modal
        centered
        width={"80%"}
        title="Danh sách sản phẩm"
        open={addProductsModalVisible}
        onCancel={() => {
          setAddProductsModalVisible(false);
        }}
        onOk={() => {
          setAddProductsModalVisible(false);
        }}
      >
        {products &&
          products.map((p: any) => {
            return (
              <Card key={p._id}>
                <strong className="px-2">{p.name}</strong>
                <Button
                  className="px-2"
                  onClick={async () => {
                    const response = await axiosClient.get(
                      "orders/" + selectedOrder._id
                    );
                    const currentOrder = response.data;
                    const { orderDetails } = currentOrder;
                    const found = orderDetails.find(
                      (x: any) => x.productId === p._id
                    );
                    if (found) {
                      found.quantity++;
                    } else {
                      orderDetails.push({
                        productId: p._id,
                        quantity: 1,
                      });
                    }

                    await axiosClient.patch("orders/" + selectedOrder._id, {
                      orderDetails,
                    });
                    setRefresh((f) => f + 1);
                    message.success(
                      `Add product: "${p.name}"  into order sucessfully!!`,
                      1.5
                    );
                    // setAddProductsModalVisible(false);

                    // RELOAD //
                  }}
                >
                  <span>Add</span>
                </Button>
              </Card>
            );
          })}
        <Pagination
          className="py-4 container text-end "
          onChange={(e) => slideCurrentProduct(e)}
          defaultCurrent={1}
          total={pageProducts}
        />
      </Modal>
      <Row>
        <Col span={24}>
          {" "}
          <Table
            bordered
            pagination={false}
            scroll={{ x: "max-content", y: "max-content" }}
            rowKey="_id"
            dataSource={orders}
            columns={columns}
          />
        </Col>
        <Modal
          width={"100%"}
          onCancel={() => {
            setSelectedOrder(null);
          }}
          onOk={() => {
            setSelectedOrder(null);
          }}
          open={selectedOrder}
        >
          <Col>
            {selectedOrder && (
              <Card title="Order Detail">
                <div>
                  {/* Description of order */}
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
                              const req = await axios.patch(
                                `${URL_ENV}/orders/${selectedOrder._id}`,
                                {
                                  status: e,
                                }
                              );
                              if (req.data) {
                                const count = setTimeout(() => {
                                  message.success(
                                    `Change status to ${req.data.status} successfully!!`,
                                    1.5
                                  );
                                  setRefresh((f) => f + 1);
                                  setComponentDisabled(!componentDisabled);
                                }, 2000);
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
                              const req = await axios.patch(
                                `${URL_ENV}/orders/${selectedOrder._id}`,
                                {
                                  shippingAddress: e,
                                }
                              );
                              if (req.data) {
                                const count = setTimeout(() => {
                                  message.success(
                                    `Change Shipping address to ${req.data.status} successfully!!`,
                                    1.5
                                  );
                                  setRefresh((f) => f + 1);
                                  setShippingAddressDisabled(
                                    !shippingAddressDisabled
                                  );
                                }, 2000);
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
                      setAddProductsModalVisible(true);
                    }}
                  >
                    Thêm sản phẩm
                  </Button>
                </div>
              </Card>
            )}
          </Col>
        </Modal>
      </Row>
      <Pagination
        className="container text-end"
        onChange={(e) => slideCurrent(e)}
        defaultCurrent={1}
        total={pages}
      />
    </div>
  );
}
