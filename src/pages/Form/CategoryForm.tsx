import { Select, Checkbox, InputNumber } from "antd";
import { Input } from "antd";
import FormItem from "antd/es/form/FormItem";

const CategoryForm = () => {
  const formItemsConfig = [
    {
      label: "Id",
      name: "_id",
      className: "hidden",
      element: <Input />,
    },
    {
      label: "Name",
      name: "name",
      rules: [{ required: true, message: "Please input Name!" }],
      element: <Input />,
    },
    {
      label: "Description",
      name: "description",
      rules: [{ required: true, message: "Please input Description!" }],
      element: <Input />,
    },
    {
      label: "coverImageUrl",
      name: "coverImageUrl",
      rules: [{ required: true, message: "Please input coverImageUrl!" }],
      element: <Input />,
    },
    {
      label: "promotionPosition",
      name: "promotionPosition",
      element: (
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
      label: "active",
      name: "active",
      valuePropName: "checked",
      element: <Checkbox />,
    },
    {
      label: "isDeleted",
      name: "isDeleted",
      valuePropName: "checked",
      element: <Checkbox />,
    },
    {
      label: "sortOrder",
      name: "sortOrder",
      element: <InputNumber min={1} />,
    },
    {
      label: "Note",
      name: "note",
      element: <Input />,
    },
  ];
  return (
    <>
      {formItemsConfig.map((item, index) => (
        <FormItem
          className={item.className && item.className}
          valuePropName={item.valuePropName && item.valuePropName}
          key={index}
          labelCol={{
            span: 7,
          }}
          wrapperCol={{
            span: 16,
          }}
          hasFeedback
          label={item.label}
          name={item.name}
          rules={item.rules}
        >
          {item.element}
        </FormItem>
      ))}
    </>
  );
};

export default CategoryForm;
