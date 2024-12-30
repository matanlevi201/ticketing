import { ExpirationCompleteEvent, Publisher, Subjects } from "@mlgittix/common";

export default class ExpirationCompletePulisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
