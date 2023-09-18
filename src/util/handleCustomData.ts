import { API_URL } from "../constants/URLS";
import { axiosClient } from "../libraries/axiosClient";
import axios from "axios"; // Make sure to import axios

export const handleCustomData = async (item: any) => {
  try {
    let res;
    switch (item.type) {
      case "GET":
        res = await axiosClient.get(`/${item.collection}`);
        return res;
      case "DELETE":
        res = await axiosClient.patch(`/${item.collection}/${item.id}`, {
          isDeleted: true,
        });
        return res.data;
      case "PATCH":
        res = await axiosClient.patch(
          `/${item.collection}/${item.id}`,
          item.data
        );
        return res.data;
      case "CREATE":
        res = await axiosClient.post(`/${item.collection}`, item.data);

        console.log(`🚀🚀🚀!..res`, res);
        const { _id } = res.data.result;
        const formData = new FormData();

        if (item.file) {
          formData.append("file", item.file);

          res = await axios.post(
            `${API_URL}/upload/${item.collection}/${_id}/image`,
            formData
          );
          // Handle the response here if needed

          return res.data;
        } else {
          return res.data;
        }
      default:
        throw new Error("Invalid item type");
    }
  } catch (error) {
    console.log(`⚠️⚠️⚠️!! handleCustomData error `, error);
    return error;
  }
};
