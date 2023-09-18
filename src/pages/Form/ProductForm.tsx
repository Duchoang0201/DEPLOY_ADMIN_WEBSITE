import React from "react";
import { Form, Input, InputNumber, Checkbox, Select } from "antd";

const ProductForm = (props: any) => {
  const { categoriesData, suppliersData } = props.props;

  const formItemData = [
    {
      label: "Id",
      name: "_id",
      className: "hidden",
      component: <Input />,
    },
    {
      label: "Category",
      name: "categoryId",
      rules: [
        {
          required: true,
          message: "Please enter Category Name",
        },
      ],
      component: (
        <Select
          showSearch
          placeholder="Select a category"
          optionFilterProp="children"
          filterOption={(input: any, option: any) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={categoriesData?.map((item: any, index: any) => {
            return {
              label: `${item.name}`,
              value: item._id,
            };
          })}
        />
      ),
    },
    {
      label: "Suppliers",
      name: "supplierId",
      rules: [
        {
          required: true,
          message: "Please enter Supplier Name",
        },
      ],
      component: (
        <Select
          showSearch
          placeholder="Select a supplier"
          optionFilterProp="children"
          filterOption={(input: any, option: any) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={suppliersData?.map((item: any, index: any) => {
            return {
              label: `${item.name}`,
              value: item._id,
            };
          })}
        />
      ),
    },
    {
      label: "Name",
      name: "name",
      rules: [
        {
          required: true,
          message: "Please enter Product Name",
        },
      ],
      component: <Input />,
    },
    {
      label: "Price",
      name: "price",
      rules: [
        {
          required: true,
          message: "Please enter Price",
        },
      ],
      component: (
        <InputNumber
          style={{ width: "100%" }}
          min={1}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value: any) =>
            value!.replace(/\s?d|(\.*)/g, "").replace(/\./g, "")
          }
        />
      ),
    },
    {
      label: "Discount",
      name: "discount",
      rules: [
        {
          required: true,
          message: "Please enter Discount",
        },
      ],
      component: <InputNumber min={1} max={75} />,
    },
    {
      label: "Stock",
      name: "stock",
      rules: [
        {
          required: true,
          message: "Please enter Stock",
        },
      ],
      component: <InputNumber min={1} />,
    },
    {
      label: "Active",
      name: "active",
      component: <Checkbox />,
      valuePropName: "checked",
    },
    {
      label: "Promotion Position",
      name: "promotionPosition",
      component: (
        <Select
          mode="multiple"
          allowClear
          showSearch
          placeholder="Select promotion"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            {
              value: "TOP-MONTH",
              label: "TOP-MONTH",
            },
            {
              value: "DEAL",
              label: "DEAL",
            },
          ]}
        />
      ),
    },
    {
      label: "isDeleted",
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

  return (
    <>
      {formItemData.map((item, index) => (
        <Form.Item
          key={index}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          hasFeedback
          label={item.label}
          name={item.name}
          rules={item.rules}
          className={item.className && item.className}
          valuePropName={item.valuePropName && item.valuePropName}
        >
          {item.component}
        </Form.Item>
      ))}
    </>
  );
};

export default ProductForm;
