import {
  categoryIdValidate,
  getCategoryValidate,
  customerIdValidate,
  getCustomersValidate,
  supplierIdValidate,
  getSuppliersValidate,
  productIdValidate,
  getProductsValidate,
} from "./indexValidate";
export const functionValidate = async (data: any) => {
  try {
    const res = { oke: false };
    switch (data.collection) {
      case "Category":
        await categoryIdValidate.validate(data.data._id);
        await getCategoryValidate.validate(data.data);
        res.oke = true;
        return res;
      case "Supplier":
        await supplierIdValidate.validate(data.data._id);
        await getSuppliersValidate.validate(data.data);
        res.oke = true;
        return res;
      case "Customer":
        await customerIdValidate.validate(data.data._id);
        await getCustomersValidate.validate(data.data);
        res.oke = true;
        return res;
      case "Product":
        await productIdValidate.validate(data.data._id);
        await getProductsValidate.validate(data.data);
        res.oke = true;
        return res;

      default:
        throw new Error("Invalid item type");
    }
  } catch (error) {
    return error;
  }
};
