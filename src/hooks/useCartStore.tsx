import create from "zustand";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  devtools(
    persist(
      (set: any, get: any) => ({
        items: [],
        add: ({ product, quantity }: any) => {
          const items = get().items;
          const found = items.find(
            (x: any) => x?.product?._id === product?._id
          );
          if (found) {
            found.quantity++;
          } else {
            items.push({ product, quantity }); // Initialize quantity to 1 for new items
          }

          return set({ items: [...items] }, false, { type: "carts/addToCart" });
        },
        remove: (id: any) => {
          const items = get().items;
          const newItems = items.filter((x: any) => x.product._id !== id);
          return set({ items: [...newItems] }, false, {
            type: "carts/removeFromCart",
          });
        },

        increase: (id: any) => {
          const items = get().items;
          const found = items.find((x: any) => x.product._id === id);
          if (found) {
            found.quantity++;
            return set({ items: [...items] }, false, {
              type: "carts/increase",
            });
          }
          return null; // handle the case when item is not found
        },

        decrease: (id: any) => {
          const items = get().items;
          const found = items.find((x: any) => x.product._id === id);
          if (found) {
            if (found.quantity === 1) {
              const newItems = items.filter(
                (x: any) => x.product._id !== found.product.id
              );
              return set({ items: [...newItems] }, false, {
                type: "carts/decrease",
              });
            } else {
              found.quantity--;
              return set({ items: [...items] }, false, {
                type: "carts/decrease",
              });
            }
          }
          return null; // handle the case when item is not found
        },
      }),
      {
        name: "count_Cart", // unique name
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      }
    )
  )
);
