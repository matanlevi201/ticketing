import { PasswordInput } from "@mantine/core";
import { Input } from "../types";
import { signin } from "../api/auth";
import Form from "../components/Form";
import { useSignin, useUpdateOrders } from "../stores/state-ctx";
import { getOrders } from "../api/orders";

interface SigninProps {
  [key: string]: any;
}

const Signin = ({ close }: SigninProps) => {
  const signinCtx = useSignin();
  const updateOrders = useUpdateOrders();
  const inputs: Input[] = [
    {
      label: "Email",
      placeholder: "your@email.com",
      required: true,
      name: "email",
      validate: (value: string) => (!value.length ? "Email is required" : null),
    },
    {
      label: "Password",
      placeholder: "Password",
      required: true,
      name: "password",
      validate: (value: string) =>
        !value.length ? "Password is required" : null,
      component: PasswordInput,
    },
  ];

  const submit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const data = await signin({ email, password });
    if (data) {
      signinCtx(data);
      const orders = await getOrders();
      updateOrders(orders ?? []);
    }
    close();
  };

  return <Form inputs={inputs} submit={submit} />;
};

export default Signin;
