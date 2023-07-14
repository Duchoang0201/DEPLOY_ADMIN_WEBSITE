import React, { useEffect, useRef, useState } from "react";
import MessageBox from "../MessageBox/MessageBox";
import { useChat } from "../../../../hooks/useChat";
import { axiosClient } from "../../../../libraries/axiosClient";
import { API_URL } from "../../../../constants/URLS";
import { io } from "socket.io-client";

type Props = {};

const Body = (props: Props) => {
  const { conversationData } = useChat((state: any) => state);
  const [messages, setMessages] = useState<any>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = useRef<any>();
  socket.current = io(API_URL);

  //BODY JOIN ROOM:

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });

    const data = {
      room: conversationData?.conversationId,
    };
    socket.current?.emit("client-message", data);

    socket.current?.on("direct-message", (data: any) => {
      const { newData } = data;

      setMessages([...messages, newData]);
      scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [conversationData?.conversationId, messages]);

  console.log("««««« messages »»»»»", messages);
  useEffect(() => {
    ///get Messages
    const getMessages = async () => {
      try {
        const res = await axiosClient.get(
          `/messages/${conversationData?.conversationId}`
        );
        if (res.data) {
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    getMessages();
  }, [conversationData?.conversationId]);

  // useEffect(() => {
  //   scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages.length]);

  return (
    <div>
      <div className="flex-1 overflow-y-auto max-h-96">
        {messages.map((message: any, i: any) => (
          <MessageBox
            isLast={i === messages.length - 1}
            key={`${message._id}-${i + 1}`}
            data={message}
          />
        ))}
        <div className="pt-10" ref={scrollRef} />
      </div>
    </div>
  );
};

export default Body;
