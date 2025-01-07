import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { record } from "../../api/payments";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  useMantineColorScheme,
} from "@mantine/core";
import classes from "./style.module.css";
import { useDisclosure } from "@mantine/hooks";
import { errorNotifications } from "../../utils";
import RingLoader from "../../components/RingLoader";
import { useUpdateOrders } from "../../stores/state-ctx";
import { getOrders } from "../../api/orders";

interface CheckoutProps {
  [key: string]: any;
}
interface CheckoutFormProps {
  stripePromise: Promise<Stripe | null> | null;
  clientSecret: string;
}

interface FooterProps extends CheckoutProps {
  open: () => void;
  close: () => void;
}

const CheckoutForm = ({ clientSecret, stripePromise }: CheckoutFormProps) => {
  return (
    <div>
      {clientSecret && stripePromise && (
        <form id="payment-form">
          <PaymentElement />
        </form>
      )}
    </div>
  );
};

const CheckoutFooter = ({ order, open, close, closeModal }: FooterProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const updateOrders = useUpdateOrders();
  const { colorScheme } = useMantineColorScheme();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const startLoading = () => {
    setIsProcessing(true);
    open();
  };

  const stopLoading = () => {
    setIsProcessing(false);
    close();
  };
  const submit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    startLoading();
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    });
    stopLoading();

    if (paymentIntent?.status !== "succeeded") {
      const errors = [{ message: error?.message ?? "Something went wrong" }];
      return errorNotifications("Payment failed!", errors);
    }
    await record({ paymentIntentId: paymentIntent.id, orderId: order.id });
    const orders = await getOrders();
    if (orders) updateOrders(orders);
    closeModal();
  };

  return (
    <Flex justify="end" direction="column">
      <Button
        mt="16px"
        className={colorScheme === "dark" ? classes.stripe_btn_night : ""}
        disabled={isProcessing || !stripe || !elements}
        onClick={submit}
      >
        {isProcessing ? "Processing ... " : "Pay now"}
      </Button>
    </Flex>
  );
};

const Checkout = ({
  publishableKey,
  pubClientSecret,
  order,
  close: closeModal,
}: CheckoutProps) => {
  const { colorScheme } = useMantineColorScheme();
  const [visible, { open, close }] = useDisclosure(false);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");

  const setCredantials = async () => {
    if (publishableKey) setStripePromise(loadStripe(publishableKey));
    if (pubClientSecret) setClientSecret(pubClientSecret);
  };

  useEffect(() => {
    setCredantials();
  }, []);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: colorScheme === "dark" ? "night" : "flat" },
      }}
    >
      <Box pos="relative">
        <LoadingOverlay
          visible={visible}
          loaderProps={{ children: <RingLoader /> }}
        />
        <CheckoutForm
          stripePromise={stripePromise}
          clientSecret={clientSecret}
        />
      </Box>

      <CheckoutFooter
        order={order}
        open={open}
        close={close}
        closeModal={closeModal}
      />
    </Elements>
  );
};

export default Checkout;
