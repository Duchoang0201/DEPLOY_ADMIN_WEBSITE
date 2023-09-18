const yup = require("yup");

export const supplierIdValidate = yup.object({
  id: yup.string(),
});

export const getSuppliersValidate = yup.object({
  name: yup.string(),
  email: yup.string(),
  phoneNumber: yup.string().matches(/^\d+$/, "phoneNumber is not valid Number"),
  address: yup.string(),
  skip: yup
    .string()
    .matches(/^\d+$/, "skip is not valid Number")
    .min(0)
    .max(1000),
  limit: yup
    .string()
    .matches(/^\d+$/, "limit is not valid Number")
    .min(0)
    .max(1000),
});
