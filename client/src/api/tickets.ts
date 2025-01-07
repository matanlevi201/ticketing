import { Ticket } from "../types";
import {
  errorNotifications,
  makeRequest,
  successNotifications,
} from "../utils";

const BASE_URL = "/api/tickets";

interface TicketCreationBody {
  title: string;
  price: string;
}

export const getTickets = async () => {
  const { errors, data: tickets } = await makeRequest<never, Ticket[]>({
    method: "get",
    url: BASE_URL,
  });
  if (errors.length) {
    return errorNotifications("Failed to get tickets", errors);
  }
  return tickets;
};

export const createTicket = async ({ title, price }: TicketCreationBody) => {
  const { errors, data: ticket } = await makeRequest<
    TicketCreationBody,
    Ticket
  >({
    method: "post",
    url: BASE_URL,
    body: { title, price },
  });
  if (errors.length) {
    return errorNotifications("Failed to create ticket", errors);
  }
  successNotifications("Ticket created", ["Ticket has been created"]);
  return ticket;
};
