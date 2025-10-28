"use client";

export const PAYMENT_PROVIDERS = [
  { value: "easypaisa", label: "EasyPaisa" },
  { value: "jazzcash", label: "JazzCash" },
  { value: "stripe", label: "Stripe" },
];

const handleResponse = async (response) => {
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = { success: false, error: "Unable to parse response from payment endpoint." };
  }

  if (!response.ok || body?.success === false) {
    const message = body?.error || "Payment request failed.";
    throw new Error(message);
  }

  return body;
};

export const createPaymentLink = async ({ amount, currency = "PKR", provider, metadata = {} }) => {
  const payload = {
    amount,
    currency,
    provider,
    metadata,
  };

  const response = await fetch("/api/payments/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};
