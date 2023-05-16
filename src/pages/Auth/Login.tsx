import React from "react";
import { Button, Form, Input } from "antd";
import style from "./login.module.css";
import { useAuthStore } from "../../hooks/useAuthStore";

const Login = () => {
  const { login } = useAuthStore((state: any) => state);

  const onLogin = async (values: any) => {
    const { email, password } = values;
    login({ email, password });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={`${style.form_box}`}>
        <h2 className={`${style.title}`}>Login</h2>

        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{ remember: true }}
          onFinish={onLogin}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email không được để trống" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống" },
              {
                min: 6,
                max: 10,
                message: "Độ dài mật khẩu phải nằm trong khoảng 6 đến 10 ký tự",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
