import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  Modal,
  Descriptions,
  Divider,
  Row,
  Col,
} from "antd";
import numeral from "numeral";
import axios from "axios";
import { axiosClient } from "../../libraries/axiosClient";

export default function Orders() {
  const [refresh, setRefresh] = useState(0);
  const [indexDelete, setIndexDelete] = useState(0);
  const [open, setOpen] = useState(false);
  const [addProductsModalVisible, setAddProductsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  // Products
  const [products, setProducts] = useState<any>([]);
  useEffect(() => {
    axios.get("http://localhost:9000/products").then((response) => {
      setProducts(response.data.results);
    });
  }, [refresh]);

  const [orders, setOrders] = useState<any>([]);
  console.log("««««« orders »»»»»", orders);
  useEffect(() => {
    axiosClient.get("/orders").then((response) => {
      setOrders(response.data);
    });
  }, [refresh, open]);

  useEffect(() => {
    if (open) {
      setOpen(true);
    }
  }, [open]);

  const handleDelete = async (record: any, index: any) => {
    const currentProduct = record;
    const response = await axiosClient.get("orders/" + selectedOrder._id);
    const currentOrder = response.data;
    const { orderDetails } = currentOrder;
    const remainOrderDetails = orderDetails.filter((x: any) => {
      return x.productId.toString() !== currentProduct.productId.toString();
    });
    console.log("remainOrderDetails", remainOrderDetails);
    const results = await axiosClient.patch("orders/" + selectedOrder._id, {
      orderDetails: remainOrderDetails,
    });

    if (results) {
      orders[indexDelete].orderDetails = remainOrderDetails;
      setOpen(false);
    }

    setTimeout(() => {
      setOpen(true);
    }, 1);
  };

  const productColumns = [
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
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
        return <Button onClick={() => handleDelete(record, index)}>Xóa</Button>;
      },
    },
  ];

  // Orders
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (text: any, record: any) => {
        return (
          <strong>
            {record.customer?.firstName} {record.customer?.lastName}
          </strong>
        );
      },
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },

    {
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
          let sum = od.quantity * od.product.total;
          total = total + sum;
        });

        return <strong>{total}</strong>;
      },
    },
    {
      title: "",
      key: "actions",
      render: (text: any, record: any, index: any) => {
        return (
          <Button
            onClick={() => {
              setSelectedOrder(record);
              setOpen(true);
              setIndexDelete(index);
            }}
          >
            Select
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      {/* Modal specific orders */}
      <div>
        {" "}
        <Modal
          centered
          width={"90%"}
          title="Chi tiết đơn hàng"
          open={open}
          onOk={() => {
            setOpen(false);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        >
          {selectedOrder && (
            <div>
              {/* Description of order */}
              <Descriptions
                bordered
                column={1}
                labelStyle={{ fontWeight: "700" }}
              >
                <Descriptions.Item label="Trạng thái">
                  {selectedOrder.status}
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  {selectedOrder.customer?.firstName}{" "}
                  {selectedOrder.customer?.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Nhân viên">
                  {selectedOrder.employee?.firstName}{" "}
                  {selectedOrder.employee?.lastName}
                </Descriptions.Item>
              </Descriptions>
              <Divider />

              {/* Table include product of orderDetails */}
              <Table
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
          )}
        </Modal>
      </div>

      {/* Modal add product */}
      <Modal
        centered
        width={"80%"}
        title="Danh sách sản phẩm"
        open={addProductsModalVisible}
        onCancel={() => {
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

                    setAddProductsModalVisible(false);

                    // RELOAD //
                  }}
                >
                  <span>Add</span>
                </Button>
              </Card>
            );
          })}
      </Modal>
      <Row>
        <Col span={24}>
          {" "}
          <Table rowKey="_id" dataSource={orders} columns={columns} />
        </Col>
      </Row>
      {selectedOrder && (
        <Row>
          <Col span={24}>
            {" "}
            {selectedOrder && (
              <div>
                {/* Description of order */}
                <Descriptions
                  bordered
                  column={1}
                  labelStyle={{ fontWeight: "700" }}
                >
                  <Descriptions.Item label="Trạng thái">
                    {selectedOrder.status}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khách hàng">
                    {selectedOrder.customer?.firstName}{" "}
                    {selectedOrder.customer?.lastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nhân viên">
                    {selectedOrder.employee?.firstName}{" "}
                    {selectedOrder.employee?.lastName}
                  </Descriptions.Item>
                </Descriptions>
                <Divider />

                {/* Table include product of orderDetails */}
                <Table
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
            )}
          </Col>
        </Row>
      )}
    </div>
  );
}
