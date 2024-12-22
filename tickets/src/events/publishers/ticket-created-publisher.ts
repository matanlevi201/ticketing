import { Publisher, Subjects, TicketCreatedEvent } from "@mlgittix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
