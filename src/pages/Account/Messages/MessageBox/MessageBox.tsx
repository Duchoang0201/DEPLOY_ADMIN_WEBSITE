import { useRef } from "react";
import clsx from "clsx";
import { Avatar } from "antd";
// import { format } from "date-fns";
import { useAuthStore } from "../../../../hooks/useAuthStore";
import { format } from "timeago.js";
import { API_URL } from "../../../../constants/URLS";
import { io } from "socket.io-client";

const MessageBox: React.FC<any> = ({ isLast, data }) => {
  // const [imageModalOpen, setImageModalOpen] = useState(false);
  const socket = useRef<any>();
  socket.current = io(API_URL);

  const { auth } = useAuthStore((state: any) => state);
  const isOwn = data.sender === auth?.payload?._id;

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm  w-fit rounded-lg  py-2 px-3 max-w-xs",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    // data?.employeeInfo?.imageUrl ? "rounded-md p-0" : "rounded-full py-2 px-3",
    "whitespace-normal break-words" // Apply the Tailwind CSS classes to wrap the text
  );

  //CONECT SOCKET.IO

  socket.current?.on("direct-message", (data: any) => {
    console.log("Received direct message:", data);
  });
  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar
          size={40}
          src={
            isOwn
              ? API_URL + auth?.payload?.imageUrl
              : API_URL + data?.employee?.imageUrl
          }
        />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1  ">
          <div className="text-sm text-gray-500">
            {data?.employeeInfor?.lastName}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data?.createdAt), "p")}
          </div>
        </div>

        <div className={message}>
          <p className="text-clip overflow-hidden ...">{data.text}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
