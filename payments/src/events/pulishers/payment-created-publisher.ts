import { PaymentCreatedEvent, Publisher, Subjects } from "@mlgittix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
