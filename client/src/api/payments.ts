import {
  errorNotifications,
  makeRequest,
  successNotifications,
} from "../utils";

const BASE_URL = "/api/payments";

interface RecordCreationBody {
  paymentIntentId: string;
  orderId: string;
}

interface IntentCreationBody {
  orderId: string;
}

export const config = async () => {
  const { errors, data } = await makeRequest<
    string,
    { publishableKey: string }
  >({
    method: "get",
    url: `${BASE_URL}/config`,
  });
  if (errors.length) {
    return errorNotifications("Failed to get publishable key", errors);
  }
  return data?.publishableKey;
};

export const intent = async ({ orderId }: IntentCreationBody) => {
  const { errors, data } = await makeRequest<
    IntentCreationBody,
    { clientSecret: string }
  >({
    method: "post",
    url: `${BASE_URL}/intent`,
    body: { orderId },
  });
  if (errors.length) {
    return errorNotifications("Failed to get client secret", errors);
  }
  return data?.clientSecret;
};

export const record = async ({
  paymentIntentId,
  orderId,
}: RecordCreationBody) => {
  const { errors, data: record } = await makeRequest<
    RecordCreationBody,
    string
  >({
    method: "post",
    url: `${BASE_URL}/record`,
    body: { paymentIntentId, orderId },
  });
  if (errors.length) {
    return errorNotifications("Failed to record payment", errors);
  }
  successNotifications("Payment placed", [
    "Check your inbox. Ticket is there!",
  ]);
  return record;
};
