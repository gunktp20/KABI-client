import { AxiosError } from "axios";

const getAxiosErrorMessage = async (err: unknown) => {
  if (err instanceof AxiosError) {
    const msg =
      typeof err?.response?.data?.msg === "object"
        ? err?.response?.data?.msg[0]
        : err?.response?.data?.msg;
    if (!msg) {
      return "Some thing went wrong . Please try again";
    }
    return msg;
  }
  return "Some thing went wrong . Please try again";
};

export default getAxiosErrorMessage;
