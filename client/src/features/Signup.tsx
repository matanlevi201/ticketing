import { PasswordInput } from "@mantine/core";
import { Input } from "../types";
import { signup } from "../api/auth";
import Form from "../components/Form";
import { useSignin, useUpdateOrders } from "../stores/state-ctx";
import { getOrders } from "../api/orders";

interface SignupProps {
  [key: string]: any;
}

const Signup = ({ close }: SignupProps) => {
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
    const data = await signup({ email, password });
    if (data) {
      signinCtx(data);
      const orders = await getOrders();
      updateOrders(orders ?? []);
    }
    close();
  };

  return <Form inputs={inputs} submit={submit} />;
};

export default Signup;
