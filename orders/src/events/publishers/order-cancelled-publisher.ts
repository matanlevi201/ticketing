import { OrderCancelledEvent, Publisher, Subjects } from "@mlgittix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
