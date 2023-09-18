import { axiosClient } from "../libraries/axiosClient";

// Move the async keyword before the function keyword
export const handleGetData = async (route: string) => {
  console.log(`🚀🚀🚀!..route`, route);
  try {
    const res = await axiosClient.get(`/${route}`); // Add 'await' here to wait for the promise to resolve

    return res;
  } catch (error) {
    console.log(`🚀🚀🚀!..handleGetData Error`, error);
  }
};
