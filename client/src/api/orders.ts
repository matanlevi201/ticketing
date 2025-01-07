import { Order } from "../types";
import {
  errorNotifications,
  makeRequest,
  successNotifications,
} from "../utils";

const BASE_URL = "/api/orders";

interface OrderCreationBody {
  ticketId: string;
}

export const getOrders = async () => {
  const { errors, data: orders } = await makeRequest<never, Order[]>({
    method: "get",
    url: BASE_URL,
  });
  if (errors.length) {
    return errorNotifications("Failed to get orders", errors);
  }
  return orders;
};

export const createOrder = async ({ ticketId }: OrderCreationBody) => {
  const { errors, data: order } = await makeRequest<OrderCreationBody, Order>({
    method: "post",
    url: BASE_URL,
    body: { ticketId },
  });
  if (errors.length) {
    return errorNotifications("Failed to place order", errors);
  }
  successNotifications("Order created", ["Order was placed"]);
  return order;
};
