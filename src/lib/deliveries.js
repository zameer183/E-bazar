"use client";

export const DELIVERY_PROVIDERS = [
  { value: "tcs", label: "TCS" },
  { value: "leopards", label: "Leopards" },
  { value: "mnp", label: "M&P" },
];

const handleResponse = async (response) => {
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = { success: false, error: "Unable to parse response from delivery endpoint." };
  }

  if (!response.ok || body?.success === false) {
    const message = body?.error || "Delivery request failed.";
    throw new Error(message);
  }

  return body;
};

export const requestDeliveryQuote = async ({ provider, weight, origin, destination, metadata = {} }) => {
  const payload = {
    provider,
    weight,
    origin,
    destination,
    metadata,
  };

  const response = await fetch("/api/deliveries/quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};
