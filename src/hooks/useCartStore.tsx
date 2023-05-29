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
      (set, get) => ({
        auth: null,

        login: async ({ email, password }: isLogin) => {
          try {
            const URL_ENV =
              process.env.REACT_APP_BASE_URL || "http://localhost:9000";

            const response = await axios.post(
              `${URL_ENV}http://localhost:9000/employees/login`,
              {
                email: email,
                password: password,
              }
            );
            set({ auth: response.data }, false, { type: "auth/login-success" });
          } catch (err) {
            set({ auth: null }, false, { type: "auth/login-error" });
            throw new Error("Login failed");
          }
        },
        logout: () => {
          // AXIOS: Call 1 api login => user
          return set({ auth: null }, false, { type: "auth/logout-success" });
        },
      }),
      {
        name: "adminWeb-storage", // unique name
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
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
