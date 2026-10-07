// PostgREST `or` filter that hides online-payment orders until Razorpay confirms
// payment. Such an order row exists from the moment the payment modal opens (so
// the webhook can match it), but it only counts as a real order once paid.
// COD orders are always visible.
export const VISIBLE_ORDERS_FILTER =
  'payment_method.is.null,payment_method.neq."Online Payment",payment_status.eq.paid';
