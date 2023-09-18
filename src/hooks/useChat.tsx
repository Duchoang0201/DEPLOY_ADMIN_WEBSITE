import create from "zustand";
import { devtools } from "zustand/middleware";
import { message } from "antd";

export const useChat = create(
  devtools((set: any, get: any) => {
    return {
      conversationData: {},
      getConversation: async (data: any) => {
        try {
          set({ conversationData: data }, false, { type: "get/Conversation" });
        } catch (err: any) {
          set({ auth: null }, false, { type: "auth/login-error" });
          // throw new Error("Login failed");
          throw message.error("Account's not found", 1.5);
        }
      },
    };
  })
);
