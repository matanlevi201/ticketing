import axios from "axios";
import { ErrorResponse, RequestProps } from "./types";
import { notifications } from "@mantine/notifications";

export const makeRequest = async <T, K>({
  method,
  url,
  body,
}: RequestProps<T>) => {
  const result: { errors: ErrorResponse; data: K | null } = {
    errors: [],
    data: null,
  };
  try {
    const response = await axios({ method, url, data: body });
    result.data = response.data;
    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const { errors } = error.response.data as { errors: ErrorResponse };
      result.errors.push(...errors);
      return result;
    }
    const unexpectedError = (error as Error)?.message ?? "Something went wrong";
    result.errors.push({ message: unexpectedError });
    return result;
  }
};

export const errorNotifications = (title: string, errors: ErrorResponse) => {
  errors.map((error) =>
    notifications.show({
      title,
      message: `${error.message} 🌟`,
      color: "red",
    })
  );
};

export const successNotifications = (title: string, messages: string[]) => {
  messages.map((message) =>
    notifications.show({
      title,
      message: `${message} 🌟`,
      color: "green",
    })
  );
};
