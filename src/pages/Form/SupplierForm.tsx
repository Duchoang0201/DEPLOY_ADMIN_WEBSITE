import React from "react";
import { Form, Input, Checkbox } from "antd";

const formItems = [
  {
    label: "Id",
    name: "_id",
    className: "hidden",

    component: <Input />,
  },
  {
    label: "Name",
    name: "name",
    rules: [{ required: true, message: "Please input Name!" }],
    component: <Input />,
  },
  {
    label: "Email",
    name: "email",
    rules: [{ required: true, message: "Please input Email!" }],
    component: <Input />,
  },
  {
    label: "Phone",
    name: "phoneNumber",
    component: <Input />,
  },
  {
    label: "Address",
    name: "address",
    rules: [{ required: true, message: "Please input Address!" }],
    component: <Input />,
  },
  {
    label: "Active",
    name: "active",
    component: <Checkbox />,
    valuePropName: "checked",
  },
  {
    label: "Is Deleted",
    name: "isDeleted",
    component: <Checkbox />,
    valuePropName: "checked",
  },
  {
    label: "Note",
    name: "note",
    component: <Input />,
  },
];

function SupplierForm() {
  return (
    <>
      {formItems.map((item) => (
        <Form.Item
          key={item.name}
          labelCol={{
            span: 7,
          }}
          wrapperCol={{
            span: 16,
          }}
          className={item.className && item.className}
          hasFeedback
          label={item.label}
          name={item.name}
          rules={item.rules}
          valuePropName={item.valuePropName && item.valuePropName}
        >
          {item.component}
        </Form.Item>
      ))}
    </>
  );
}

export default SupplierForm;
