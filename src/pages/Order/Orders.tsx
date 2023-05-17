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
  useEffect(() => {
    axiosClient.get("/orders").then((response) => {
      setOrders(response.data);
    });
  }, [refresh]);

  useEffect(() => {
    // Check if the selected order exists in the updated dataResource
    const updatedSelectedOrder = orders.find(
      (order: any) => order.id === selectedOrder?.id
    );
    setSelectedOrder(updatedSelectedOrder || null);
  }, [orders, selectedOrder]);

  const handleDelete = async (record: any, index: any) => {
    const currentProduct = record;
    const response = await axiosClient.get("orders/" + selectedOrder._id);
    const currentOrder = response.data;
    const { orderDetails } = currentOrder;
    const remainOrderDetails = orderDetails.filter((x: any) => {
      return x.productId.toString() !== currentProduct.productId.toString();
    });
    console.log("remainOrderDetails", remainOrderDetails);
    await axiosClient.patch("orders/" + selectedOrder._id, {
      orderDetails: remainOrderDetails,
    });
    setRefresh((f) => f + 1);
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
        const handleDeleteClick = () => {
          handleDelete(record, index);
        };

        return (
          <>
            <div>
              <Button onClick={handleDeleteClick}>Xóa</Button>
            </div>
          </>
        );
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
      width: "10%",

      title: "Hình thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      width: "10%",

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
      width: "10%",

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
            }}
          >
            Select
          </Button>
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

                    // setAddProductsModalVisible(false);

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
          <Table
            scroll={{ x: 200 }}
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
    </div>
  );
}

// {open && (
//   <Row>
//     <Col span={24}>
//       {" "}
//       {open && (
//         <Card title="Order Detail">
//           <div>
//             {/* Description of order */}
//             <Descriptions
//               bordered
//               column={1}
//               labelStyle={{ fontWeight: "700" }}
//             >
//               <Descriptions.Item label="Trạng thái">
//                 {selectedOrder.status}
//               </Descriptions.Item>
//               <Descriptions.Item label="Khách hàng">
//                 {selectedOrder.customer?.firstName}{" "}
//                 {selectedOrder.customer?.lastName}
//               </Descriptions.Item>
//               <Descriptions.Item label="Nhân viên">
//                 {selectedOrder.employee?.firstName}{" "}
//                 {selectedOrder.employee?.lastName}
//               </Descriptions.Item>
//             </Descriptions>
//             <Divider />

//             {/* Table include product of orderDetails */}
//             <Table
//               scroll={{ x: 200 }}
//               rowKey="_id"
//               dataSource={selectedOrder.orderDetails}
//               columns={productColumns}
//             />

//             <Button
//               onClick={() => {
//                 setAddProductsModalVisible(true);
//               }}
//             >
//               Thêm sản phẩm
//             </Button>
//           </div>
//         </Card>
//       )}
//     </Col>
//   </Row>
// )}
