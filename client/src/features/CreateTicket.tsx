import { NumberInput } from "@mantine/core";
import { Input } from "../types";
import { createTicket } from "../api/tickets";
import Form from "../components/Form";
import { useTickets, useUpdateTickets } from "../stores/state-ctx";

interface CreateTicketProps {
  [key: string]: any;
}

const CreateTicket = ({ close }: CreateTicketProps) => {
  const updateTickets = useUpdateTickets();
  const tickets = useTickets();
  const inputs: Input[] = [
    {
      label: "Title",
      placeholder: "Title",
      required: true,
      name: "title",
      validate: (value: string) => (!value.length ? "Title is required" : null),
    },
    {
      label: "Price",
      placeholder: "Price",
      required: true,
      name: "price",
      validate: (value: string) => (!value ? "Price is required" : null),
      component: NumberInput,
    },
  ];

  const submit = async ({ title, price }: { title: string; price: number }) => {
    const newTicket = await createTicket({ title, price: String(price) });
    if (newTicket) {
      updateTickets([newTicket, ...tickets]);
    }
    close();
  };

  return <Form inputs={inputs} submit={submit} />;
};

export default CreateTicket;
