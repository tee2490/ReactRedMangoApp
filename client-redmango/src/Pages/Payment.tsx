import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import { PaymentForm } from "../Components/Page/Payment";

const stripePromise = loadStripe(
  "pk_test_51M9JKILEJFIvBBF2XkujZkrsfTEzCwhb6Mju4cg46E92bFLupZh7FxanSKa17WqSqpfl3WuQ1K3AL2VbK1wCrg9200hagD6XvF"
);

function Payment() {
  const {
    state: { apiResult, userInput },
  } = useLocation();

  const options = {
    // passing the client secret obtained from the server
    clientSecret: apiResult.clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm />
    </Elements>
  );
}

export default Payment;
