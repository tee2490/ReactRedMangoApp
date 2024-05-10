import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { toastNotify } from "../../../Helper";
import { useState } from "react";
import { orderSummaryProps } from "../Order/orderSummaryProps";
import { apiResponse, cartItemModel } from "../../../Interfaces";
import { useCreateOrderMutation } from "../../../Apis/orderApi";
import { SD_Status } from "../../../Common/SD";
import { useNavigate } from "react-router-dom";

const PaymentForm = ({ data, userInput }: orderSummaryProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [createOrder] = useCreateOrderMutation();

  const stripe = useStripe();
  const elements = useElements();

  console.log("data");
  console.log(data);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    //ส่งไปยัง stripe โดยตรง ไม่ต้องผ่าน API
    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
      redirect: "if_required",
    });

    if (result.error) {
      toastNotify("An unexpected error occured.", "error");
      setIsProcessing(false);
    } else {
      console.log(result);

      // มาจาก Post : /api/Order
      // "pickupName": "string",
      // "pickupPhoneNumber": "string",
      // "pickupEmail": "string",
      // "applicationUserId": "string",
      // "orderTotal": 0,
      // "stripePaymentIntentID": "string",
      // "status": "string",
      // "totalItems": 0,
      // "orderDetailsDTO": [
      //   {
      //     "menuItemId": 0,
      //     "quantity": 0,
      //     "itemName": "string",
      //     "price": 0
      //   }
      // ]

      //สร้างออบเจคในส่วนของ OrderDetail
      let grandTotal = 0;
      let totalItems = 0;
      const orderDetailsDTO: any = [];
      data.cartItems.forEach((item: cartItemModel) => {
        const tempOrderDetail: any = {};
        tempOrderDetail["menuItemId"] = item.menuItem?.id;
        tempOrderDetail["quantity"] = item.quantity;
        tempOrderDetail["itemName"] = item.menuItem?.name;
        tempOrderDetail["price"] = item.menuItem?.price;
        orderDetailsDTO.push(tempOrderDetail);
        grandTotal += item.quantity! * item.menuItem?.price!;
        totalItems += item.quantity!;
      });

      //ส่งไปบันทึกยัง Post : /api/Order
      const response: apiResponse = await createOrder({
        pickupName: userInput.name,
        pickupPhoneNumber: userInput.phoneNumber,
        pickupEmail: userInput.email,
        totalItems: totalItems,
        orderTotal: grandTotal,
        orderDetailsDTO: orderDetailsDTO,
        stripePaymentIntentID: data.stripePaymentIntentId,
        applicationUserId: data.userId,
        status:
          result.paymentIntent.status === "succeeded"
            ? SD_Status.CONFIRMED
            : SD_Status.PENDING,
      });

      if (response) {
        if (response.data?.result.status === SD_Status.CONFIRMED) {
          navigate(
            `/order/orderConfirmed/${response.data.result.orderHeaderId}}`
          );
        } else {
          navigate("/failed");
        }
      }

    } //ปีกกาของ else
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button className="btn btn-success mt-2 w-100">Submit</button>
    </form>
  );
};

export default PaymentForm;
