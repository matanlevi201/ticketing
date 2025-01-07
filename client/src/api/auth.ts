import { CurrentUser } from "../types";
import {
  errorNotifications,
  makeRequest,
  successNotifications,
} from "../utils";

const BASE_URL = "/api/users";

interface SignBody {
  email: string;
  password: string;
}

export const signup = async ({ email, password }: SignBody) => {
  const { errors, data } = await makeRequest<SignBody, CurrentUser>({
    method: "post",
    url: `${BASE_URL}/signup`,
    body: { email, password },
  });
  if (errors.length) {
    return errorNotifications("Failed to signup", errors);
  }
  successNotifications("Sign up", ["Sign up successfully"]);
  return data;
};

export const signin = async ({ email, password }: SignBody) => {
  const { errors, data } = await makeRequest<SignBody, CurrentUser>({
    method: "post",
    url: `${BASE_URL}/signin`,
    body: { email, password },
  });
  if (errors.length) {
    return errorNotifications("Failed to signin", errors);
  }
  successNotifications("Sign in", ["Sign in successfully"]);
  return data;
};

export const signout = async () => {
  const { errors, data } = await makeRequest({
    method: "post",
    url: `${BASE_URL}/signout`,
  });
  if (errors.length) {
    return errorNotifications("Failed to signout", errors);
  }
  return data;
};

export const getCurrentUser = async () => {
  const { errors, data } = await makeRequest<
    never,
    { currentUser: CurrentUser | null }
  >({
    method: "get",
    url: `${BASE_URL}/currentuser`,
  });
  if (errors.length) {
    return errorNotifications("Failed to check current user", errors);
  }
  if (data?.currentUser)
    successNotifications("Sign up", [`Hello ${data?.currentUser?.email}`]);
  return data?.currentUser;
};
