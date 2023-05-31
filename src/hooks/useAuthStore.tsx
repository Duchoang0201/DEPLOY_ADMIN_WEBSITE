import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
interface isLogin {
  email: string;
  password: string;
}

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => {
        let loginData: any = null; // Variable to store the login data
        const URL_ENV =
          process.env.REACT_APP_BASE_URL || "http://localhost:9000";

        return {
          auth: null,
          login: async ({ email, password }: isLogin) => {
            try {
              const response = await axios.post(`${URL_ENV}/employees/login`, {
                email: email,
                password: password,
              });
              loginData = response.data; // Store the response data

              set({ auth: response.data }, false, {
                type: "auth/login-success",
              });
              if (loginData && loginData.payload && loginData.payload._id) {
                axios.patch(`${URL_ENV}/employees/${loginData.payload._id}`, {
                  lastActivity: new Date(),
                });
              }
            } catch (err) {
              set({ auth: null }, false, { type: "auth/login-error" });
              throw new Error("Login failed");
            }
          },
          logout: async () => {
            // Use the loginData in the logout function

            if (loginData && loginData.payload && loginData.payload._id) {
              axios.patch(`${URL_ENV}/employees/${loginData.payload._id}`, {
                lastActivity: new Date(),
              });
            }
            localStorage.clear();

            return set({ auth: null }, false, { type: "auth/logout-success" });
          },
        };
      },
      {
        name: "adminWeb-storage", // unique name
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

//persist ( DUY TRÌ TRẠNG THÁI CỦA STORE'STATE qua các lần TẢI LẠI, STATE KHÔNG THAY ĐỔI KHI F5)
// Zustand's persist is another optional package that can be used
// to persist your store's state across page reloads or browser sessions.

// With persist, you can store your store's state in localStorage, sessionStorage,
// or any other custom storage solution. This way, when the user refreshes or closes the page,
// the state is automatically restored when the page is reopened.

// Devtools
// Usage with a plain action store, it will log actions as "setState"
