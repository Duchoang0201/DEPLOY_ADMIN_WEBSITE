import React from "react";
import { Form, Input, Switch, DatePicker } from "antd";
// const lang = (navigator.language || navigator.languages[0] || "en-GB").replace(
//   "-",
//   "_"
// );
const locale = require(`antd/es/date-picker/locale/en_US`).default;

const CustomerForm = (props: any) => {
  const formFields = [
    {
      label: "Id",
      name: "_id",
      className: "hidden ",
      component: <Input />,
    },
    {
      label: "Email",
      name: "email",
      rules: [{ required: true, message: "Please input Email!" }],
      component: <Input />,
    },
    {
      label: "First name",
      name: "firstName",
      rules: [{ required: true, message: "Please input First name!" }],
      component: <Input />,
    },
    {
      label: "Last name",
      name: "lastName",
      rules: [{ required: true, message: "Please input Last name!" }],
      component: <Input />,
    },
    {
      label: "Phone number",
      name: "phoneNumber",
      rules: [{ required: true, message: "Please input Phone number!" }],
      component: <Input />,
    },
    {
      label: "Password",
      name: "password",
      rules: [{ required: true, message: "Please input Phone number!" }],
      component: <Input />,
    },
    {
      label: "Address",
      name: "address",
      rules: [{ required: true, message: "Please input Address!" }],
      component: <Input />,
    },
    {
      label: "Locked",
      name: "Locked",
      component: <Switch />,
      valuePropName: "checked",
    },
    {
      label: "Note",
      name: "note",
      component: <Input />,
    },
    {
      label: "Birthday",
      name: "birthday",
      rules: [{ required: true, message: "Please input Birthday!" }],
      component: (
        <DatePicker
          size="middle"
          placement="bottomLeft"
          format="DD/MM/YYYY"
          locale={locale}
        />
      ),
    },
  ];
  return (
    <>
      {formFields.map((field, index) => (
        <Form.Item
          key={index}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          className={field.className && field.className}
          label={field.label}
          name={field.name}
          rules={field.rules}
          valuePropName={field.valuePropName && field.valuePropName}
        >
          {field.component}
        </Form.Item>
      ))}
    </>
  );
};

export default CustomerForm;
