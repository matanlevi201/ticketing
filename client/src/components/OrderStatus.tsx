import { Chip } from "@mantine/core";
import { OrderStatus } from "../types";

const OrderStatusChip = ({ status }: { status: OrderStatus }) => {
  const statusColorMapper: Record<OrderStatus, string> = {
    [OrderStatus.Cancelled]: "red",
    [OrderStatus.Created]: "teal",
    [OrderStatus.Complete]: "green",
    [OrderStatus.AwaitingPayment]: "grape",
  };

  return (
    <Chip color={statusColorMapper[status]} variant="light" radius="sm">
      {status}
    </Chip>
  );
};

export default OrderStatusChip;
