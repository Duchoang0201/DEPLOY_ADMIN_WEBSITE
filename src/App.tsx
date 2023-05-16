import React, { useEffect, useRef, useState } from "react";
import Login from "./pages/Auth/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./hooks/useAuthStore";
import { Layout, Button, theme } from "antd";
import { io } from "socket.io-client";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import numeral from "numeral";
import "numeral/locales/vi";

import NotFoundPage from "./pages/NotFoundPage";
import MainMenu from "./components/MainMenu";
import HomePage from "./pages/HomePage";
import CategoryCRUD from "./pages/Management/categoryCRUD";
import ProductsCRUD from "./pages/Management/ProductsCRUD";
import CustomerCRUD from "./pages/Management/CustomerCRUD";
import SupperliersCRUD from "./pages/Management/SupperliersCRUD";
import Information from "./pages/Account/Information";

import Messages from "./pages/Account/Messages";
import Orders from "./pages/Order/Orders";
import SearchOrdersByStatus from "./pages/Order/SearchOrdersByStatus";
import EmployeesCRUD from "./pages/Management/EmployeesCRUD";
numeral.locale("vi");
const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const { auth } = useAuthStore((state: any) => state);

  const socket = useRef<any>();

  useEffect(() => {
    socket.current = io("http://localhost:8888");
  }, []);

  // Function reresh to clear local storage

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <div>
        <BrowserRouter>
          {!auth && (
            <Content style={{ padding: 24 }}>
              <Routes>
                <Route path="/" element={<Login />} />
                {/* NO MATCH ROUTE */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Content>
          )}

          {auth && (
            <Layout>
              <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="dark"
                style={{
                  overflow: "auto",
                  height: "100vh",
                  position: "fixed",
                  left: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <div
                  style={{
                    height: 32,
                    margin: 16,
                    background: "rgba(255, 255, 255, 0.2)",
                  }}
                />
                <MainMenu />
              </Sider>
              <Layout
                className="site-layout"
                style={{ marginLeft: collapsed ? 80 : 200 }}
              >
                <Header
                  style={{
                    padding: 0,
                    background: colorBgContainer,
                  }}
                >
                  <div className="d-flex flex-row justify-content-between">
                    <div className="LEFT">
                      {" "}
                      <Button
                        type="text"
                        icon={
                          collapsed ? (
                            <MenuUnfoldOutlined />
                          ) : (
                            <MenuFoldOutlined />
                          )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                          fontSize: "16px",
                          width: 64,
                          height: 64,
                        }}
                      />
                    </div>
                    <div className="MID d-flex flex-row justify-content-between">
                      <h1 style={{ color: "black" }}> ONLINE SHOP </h1>
                    </div>
                    <div className="RIGHT " style={{ width: "110px" }}>
                      <strong>
                        {/* {user?.firstName} {user?.lastName} */}
                      </strong>
                    </div>
                  </div>
                </Header>

                <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                  {/* Register routes */}

                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="darhboard/home" element={<HomePage />} />

                    {/* MANAGEMENT */}

                    {auth.payload.isAdmin && (
                      <Route
                        path="/management/employees"
                        element={<EmployeesCRUD />}
                      />
                    )}
                    <Route
                      path="/management/products"
                      element={<ProductsCRUD />}
                    />
                    <Route
                      path="/management/suppliers"
                      element={<SupperliersCRUD />}
                    />
                    {/* <Route
                      path="/management/employees"
                      element={<EmployeesCRUD />}
                    /> */}
                    <Route
                      path="/management/categories"
                      element={<CategoryCRUD />}
                    />

                    <Route
                      path="/management/customers"
                      element={<CustomerCRUD />}
                    />
                    <Route path="/order/orders" element={<Orders />} />
                    <Route
                      path="/order/status"
                      element={<SearchOrdersByStatus />}
                    />
                    <Route
                      path="/account/information"
                      element={<Information />}
                    />
                    <Route
                      path="/account/message"
                      element={<Messages collapsed={collapsed} />}
                    />

                    {/* SALES */}
                    {/* <Route path='/sales/products/discount' element={<DiscountPage />} />
                  <Route path='/sales/products/stock' element={<StockPage />} /> */}

                    {/* UPLOAD */}

                    {/* <Route path='/upload/form' element={<FormUpload />} />
                  <Route path='/upload/antd' element={<AntUpload />} /> */}
                    {/* NO MATCH ROUTE */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          )}
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
