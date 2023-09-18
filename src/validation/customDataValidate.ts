export const customeDataValidate = async (data: any) => {
  const paramObject: any = {};
  data.searchParams.forEach((value: any, key: any) => {
    paramObject[key] = value;
  });
  data.data = paramObject;

  return data;
};
