import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { message } from "antd";
interface isLogin {
  email: string;
  password: string;
}
const TIME_REFRESH_TOKEN = 2 * 60 * 60 * 1000;

export const useAuthStore = create(
  devtools(
    persist(
      (set: any, get: any) => {
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
              if (response.data.token) {
                loginData = response.data; // Store the response data

                set({ auth: response.data }, false, {
                  type: "auth/login-success",
                });

                // await get().dataFromToken({ token: response.data.token });
              } else {
                message.error("Login unsuccessfully!!");
              }
            } catch (err: any) {
              set({ auth: null }, false, { type: "auth/login-error" });
              // throw new Error("Login failed");
              throw message.error("Account's not found", 1.5);
            }
          },
          dataFromToken: async (token: any) => {
            try {
              const auth: any = get().auth;

              if (auth?.token && auth?.refreshToken) {
                const response: any = await axios.get(
                  `${URL_ENV}/employees/login/profile`,
                  {
                    headers: {
                      Authorization: `Bearer ${auth?.token}`,
                    },
                  }
                );
                const user = response.data;

                if (user._id) {
                  //lastActivity

                  await axios.patch(`${URL_ENV}/employees/${user._id}`, {
                    lastActivity: new Date(),
                  });
                  set({ auth: { ...auth, payload: user } }, false, {
                    type: "auth/login-success",
                  });
                }
              }
            } catch (error: any) {
              console.error("An error occurred:", error);
              if (error?.response?.data?.oke === false) {
                const auth: any = get().auth;

                const newToken = await axios.post(
                  `${URL_ENV}/employees/refreshToken`,
                  {
                    id: auth.userId,
                    refreshToken: auth?.refreshToken,
                  }
                );
                auth.token = newToken.data.accessToken;
                message.success("Logging in successfully!!!", 1.5);

                set({ auth: { ...auth } }, false, {
                  type: "auth/login-success",
                });
              }
              // Handle error
            }
          },

          // freshToken: async (token: any) => {
          //   const auth: any = get().auth;

          //   const newToken = await axios.post(
          //     `${URL_ENV}/employees/refreshToken`,
          //     {
          //       token: auth?.refreshToken,
          //     }
          //   );
          //   auth.token = newToken.data.accessToken;
          //   message.success("Loging sucessfully !!!", 1.5);

          //   set({ auth: { ...auth } }, false, {
          //     type: "auth/login-success",
          //   });
          //   try {
          //   } catch (err) {
          //     console.log("««««« err »»»»»", err);
          //   }
          // },
          setLogout: async () => {
            const auth: any = get().auth;
            const dataFromToken = get().dataFromToken;

            setTimeout(() => {
              set(
                {
                  auth: {
                    token: auth?.token,
                    refreshToken: auth?.refreshToken,
                    userId: auth?.userId,
                  },
                },
                false,
                {
                  type: "auth/login-success",
                }
              );
              // freshToken();
              dataFromToken();
            }, TIME_REFRESH_TOKEN);
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
