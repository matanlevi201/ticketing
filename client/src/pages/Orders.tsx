import { Title } from "@mantine/core";
import DataTable from "../components/table";
import { useDisclosure } from "@mantine/hooks";
import DateTimer from "../components/DateTimer";
import { useOrders } from "../stores/state-ctx";
import LocalModal from "../components/Modal";
import Checkout from "../features/checkout";
import { FC, useState } from "react";
import OrderStatusChip from "../components/OrderStatus";
import { config, intent } from "../api/payments";
import { OrderStatus } from "../types";

interface OrderItem {
  id: string;
  ticket: string;
  expiresAt: FC;
}

const Orders = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const orders = useOrders();

  const ordersToPresent = orders.map((order) => ({
    id: order.id,
    ticket: order.ticket.title,
    status: () => <OrderStatusChip status={order.status} />,
    expiresAt: () => (
      <DateTimer
        date={
          new Date(
            order.status === OrderStatus.Complete
              ? Date.now() - 5 * 60 * 1000
              : order.expiresAt
          )
        }
      />
    ),
  }));

  const purchase = async (item: OrderItem) => {
    const publishableKey = await config();
    const clientSecret = await intent({ orderId: item.id });
    if (publishableKey && clientSecret) {
      setPublishableKey(publishableKey);
      setClientSecret(clientSecret);
      setOrder(item);
      open();
    }
  };
  return (
    <>
      {publishableKey && clientSecret && order && (
        <LocalModal
          component={() => (
            <Checkout
              order={order}
              close={close}
              publishableKey={publishableKey}
              pubClientSecret={clientSecret}
            />
          )}
          componentProps={{}}
          title="Checkout"
          opened={opened}
          close={close}
        />
      )}
      <Title mb="sm">Orders</Title>
      <DataTable
        data={ordersToPresent}
        action={purchase}
        actionName="Purchase!"
        noDataMessage={"No orders yet. Go to tickets and order today !"}
      />
    </>
  );
};

export default Orders;
