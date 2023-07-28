import React, { useEffect, useRef, useState } from "react";
import Login from "./pages/Auth/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout, Button, theme, Divider, message } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";

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

import Orders from "./pages/Order/Orders";
import SearchOrdersByStatus from "./pages/Order/SearchOrdersByStatus";
import EmployeesCRUD from "./pages/Management/EmployeesCRUD";
import SlidesCRUD from "./pages/Management/SlideCRUD";
import FeaturesCRUD from "./pages/Management/FeaturesCRUD";
import { useBreadcrumb } from "./hooks/useBreadcrumb";
import { axiosClient } from "./libraries/axiosClient";
import { useAuthStore } from "./hooks/useAuthStore";
import MessagesDev from "./pages/Account/Messages/MessagesDev";
import { queryClient } from "./libraries/react-query";
numeral.locale("vi");

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const { breadCrumb } = useBreadcrumb((state: any) => state);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [user, setUser] = useState<any>();

  const { setAuth } = useAuthStore((state: any) => state);
  let token = window.localStorage.getItem("token");

  useEffect(() => {
    document.title = "Management Website";

    if (token) {
      axiosClient
        .get(`/employees/login/profile`)
        .then((res) => {
          setUser(res?.data);
          setAuth(res?.data);
        })
        .catch((err) => {
          console.log("««««« err »»»»»", err);
        });
    } else {
      message.info("Please login!!", 1.5);
    }
  }, [setAuth, token]);

  useEffect(() => {
    // Update windowWidth when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener to the window resize event
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures that the effect runs only once

  /// USER ONLINE_OFFLINE

  // Function reresh to clear local storage

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <div>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {!user?._id && (
              <Content style={{ padding: 24 }}>
                <Routes>
                  <Route path="/" element={<Login />} />
                  {/* NO MATCH ROUTE */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Content>
            )}
            {user?._id && (
              <Layout>
                <Sider
                  collapsedWidth={windowWidth <= 768 ? 0 : undefined}
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
                  <MainMenu user={user} />
                </Sider>

                <Layout
                  style={{
                    marginLeft: collapsed ? (windowWidth <= 768 ? 0 : 60) : 200,
                  }}
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
                      <div>
                        <h1 className="py-2" style={{ color: "black" }}>
                          {" "}
                          MANAGEMENT
                        </h1>
                      </div>
                      <div className="RIGHT " style={{ width: "110px" }}>
                        <strong>
                          {user?.firstName} {user?.lastName}
                        </strong>
                      </div>
                    </div>
                  </Header>
                  <div className="mx-4 my-2 text-danger">
                    {" "}
                    {breadCrumb === "Account/Logout" || breadCrumb === null ? (
                      <Divider>Dashboard/Home</Divider>
                    ) : (
                      <Divider>{breadCrumb}</Divider>
                    )}
                  </div>
                  <Content className="mx-4 my-2">
                    {/* Register routes */}

                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="darhboard/home" element={<HomePage />} />

                      {/* MANAGEMENT */}

                      {user.isAdmin && (
                        <Route
                          path="/management/employees"
                          element={<EmployeesCRUD />}
                        />
                      )}
                      <Route
                        path="/management/products"
                        element={<ProductsCRUD />}
                      />
                      <Route path="/function/slides" element={<SlidesCRUD />} />
                      <Route
                        path="/function/features"
                        element={<FeaturesCRUD />}
                      />
                      <Route
                        path="/management/suppliers"
                        element={<SupperliersCRUD />}
                      />

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
                        element={<MessagesDev collapsed={collapsed} />}
                      />

                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Content>
                </Layout>
              </Layout>
            )}
          </BrowserRouter>
        </QueryClientProvider>
      </div>
    </>
  );
};

export default App;
