import {
  CommentOutlined,
  EllipsisOutlined,
  ExportOutlined,
  HomeOutlined,
  OrderedListOutlined,
  SettingOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
import { useBreadcrumb } from "../hooks/useBreadcrumb";

const MainMenu = ({ user }: any) => {
  const { addBread } = useBreadcrumb((state: any) => state);
  const items = [
    {
      label: "Dashboard",
      key: "darhboard",
      icon: <HomeOutlined />,
      children: [
        {
          key: "darhboard/home",
          label: "Home",
        },
      ],
    },

    {
      label: "Mangement",
      key: "management",
      icon: <SettingOutlined />,
      children: [
        {
          key: "management/categories",
          label: "Categories",
        },
        {
          key: "management/suppliers",
          label: "Suppliers",
        },
        {
          key: "management/customers",
          label: "Customers",
        },

        {
          key: "management/products",
          label: "Products",
        },

        user?.isAdmin && {
          key: "management/employees",
          label: "Employees",
        },
      ],
    },
    {
      label: "Order",
      key: "order",
      icon: <OrderedListOutlined />,
      children: [
        {
          key: "order/orders",
          label: "Orders",
        },
        {
          key: "order/status",
          label: "OrderStatus",
        },
      ],
    },
    {
      label: "Function",
      key: "function",
      icon: <EllipsisOutlined />,
      children: [
        {
          key: "function/slides",
          label: "Slides",
        },
        {
          key: "function/features",
          label: "Features",
        },
      ],
    },
    {
      label: "Account",
      key: "/account",
      icon: <UsergroupAddOutlined />,
      children: [
        {
          key: "account/information",
          label: "Information",
          icon: <UserOutlined />,
        },
        {
          key: "account/message",
          label: "Message",
          icon: <CommentOutlined />,
        },
        {
          key: "account/logout",
          label: "Logout",
          icon: <ExportOutlined />,
          // render: () => {},
        },
      ],
    },
  ];

  const navigate = useNavigate();
  const { logout } = useAuthStore((state: any) => state);

  const onMenuClick = (value: any) => {
    addBread(value.key);
    if (value.key === "account/logout") {
      logout();
      navigate("/");
    } else {
      navigate("/" + value.key);
    }
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["home"]}
      items={items}
      onClick={(e) => onMenuClick(e)}
    />
  );
};

export default MainMenu;
