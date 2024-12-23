import { OrderCreatedEvent, Publisher, Subjects } from "@mlgittix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
