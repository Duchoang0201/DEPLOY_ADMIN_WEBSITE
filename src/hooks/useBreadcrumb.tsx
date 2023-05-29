import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";

export const useBreadcrumb = create(
  devtools(
    persist(
      (set, get) => {
        return {
          breadCrumb: null,
          addBread: async (bread: any) => {
            try {
              const parts = bread.split("/");
              const capitalizedParts = parts.map(
                (part: any) => part.charAt(0).toUpperCase() + part.slice(1)
              );
              const newData = capitalizedParts.join("/");
              set({ breadCrumb: newData }, false, {
                type: "breadCrumb/add-success",
              });
            } catch (error) {
              set({ breadCrumb: null }, false, {
                type: "breadCrumb/add-error",
              });
              throw new Error("failed");
            }
          },
        };
      },
      {
        name: "breadCrumb", // unique name
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
