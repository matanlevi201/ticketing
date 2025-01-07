import { Method } from "axios";

export enum OrderStatus {
  Created = "created",
  Cancelled = "cancelled",
  AwaitingPayment = "awaiting:payment",
  Complete = "complete",
}

export type CurrentUser = {
  id: string;
  email: string;
};

export type Ticket = {
  id: string;
  title: string;
  price: number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  expiresAt: string;
  ticket: Ticket;
};

export type Input = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  component?: any;
  defaultValue?: any;
  validate?: (value: any) => string | null;
};

export type RequestProps<TBody> = {
  url: string;
  method: Method;
  body?: TBody;
};

export type ErrorResponse = { message: string }[];
