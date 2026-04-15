import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

function CheckoutForm() {
const stripe = useStripe();
const elements = useElements();
const [loading, setLoading] = useState(false)


const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);

const res = await fetch("http://localhost:3001/stripe/create-payment-intent", {
method:"POST",
headers: { "Content-Type":"application/json" },
body: JSON.stringify ({ amount: 1000 }),
});
const data = await res.json();

const result =await stripe.confirmCardPayment(data.clientSecret, {
payment_method: {
 card: elements.getElement(CardElement),
},
});

if (result.error) {
alert(result.error.message);
} else {
if (result.paymentIntent.status === "succeeded") {
alert("Payment successful!");
}
}

setLoading(false);
};
return (

<form onSubmit={handleSubmit}>
<CardElement />
<button disabled={!stripe || loading}>
{loading ? "Processing ... " : "Pay"}
</button>
</form>
)};
export default CheckoutForm ;