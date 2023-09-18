import { Button, Card, Drawer, message } from "antd";
import React from "react";
import { axiosClient } from "../../libraries/axiosClient";

type Props = {
  products: any;
  addProducts: any;
  setAddProducts: any;
  selectedOrder: any;
  refetch: any;
};

const ProductDrawer = (props: Props) => {
  const { products, addProducts, setAddProducts, selectedOrder, refetch } =
    props;
  return (
    <div>
      {" "}
      <Drawer
        width={"40%"}
        title="Danh sách sản phẩm"
        open={addProducts}
        onClose={() => {
          setAddProducts(false);
        }}
        placement="right"
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
                    // setRefresh((f) => f + 1);
                    refetch();

                    message.success(
                      `Add product: "${p.name}"  into order sucessfully!!`,
                      1.5
                    );
                  }}
                >
                  <span>Add</span>
                </Button>
              </Card>
            );
          })}
      </Drawer>
    </div>
  );
};

export default ProductDrawer;
