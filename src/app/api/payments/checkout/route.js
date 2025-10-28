import { NextResponse } from "next/server";

export const runtime = "nodejs";

class IntegrationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const normalizeAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new IntegrationError("Amount must be greater than zero.");
  }
  return amount;
};

const normalizeCurrency = (currency) => {
  if (!currency) {
    return "PKR";
  }
  return String(currency).toUpperCase();
};

const sanitizeBaseUrl = (url) => url?.replace(/\/+$/, "") ?? "";

const parseJsonFromResponse = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const createStripeCheckoutSession = async ({ amount, currency, metadata }) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new IntegrationError("Stripe secret key is not configured.", 500);
  }

  const successUrl =
    process.env.STRIPE_SUCCESS_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://example.com/success";
  const cancelUrl =
    process.env.STRIPE_CANCEL_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://example.com/cancel";

  const params = new URLSearchParams({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    "line_items[0][price_data][currency]": currency.toLowerCase(),
    "line_items[0][price_data][product_data][name]":
      metadata?.productName || metadata?.label || "E-Bazar Order",
    "line_items[0][price_data][unit_amount]": Math.round(amount * 100).toString(),
    "line_items[0][quantity]": "1",
  });

  Object.entries(metadata || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    params.append(`metadata[${key}]`, String(value));
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
    body: params,
  });

  const payload = await parseJsonFromResponse(response);
  if (!response.ok) {
    const message =
      payload?.error?.message || "Stripe checkout session could not be created.";
    throw new IntegrationError(message, response.status);
  }

  return {
    reference: payload.id,
    checkoutUrl: payload.url,
    status: payload.status,
  };
};

const createEasyPaisaPayment = async ({ amount, currency, metadata }) => {
  const baseUrl = sanitizeBaseUrl(process.env.EASYPAISA_API_URL);
  const username = process.env.EASYPAISA_USERNAME;
  const password = process.env.EASYPAISA_PASSWORD;

  if (!baseUrl || !username || !password) {
    throw new IntegrationError(
      "EasyPaisa credentials are not configured. Set EASYPAISA_API_URL, EASYPAISA_USERNAME, and EASYPAISA_PASSWORD.",
      500,
    );
  }

  const endpoint = `${baseUrl}/payments`;
  const authHeader = Buffer.from(`${username}:${password}`).toString("base64");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify({
      amount,
      currency,
      metadata,
    }),
  });

  const payload = await parseJsonFromResponse(response);
  if (!response.ok) {
    const message = payload?.message || "EasyPaisa payment request failed.";
    throw new IntegrationError(message, response.status);
  }

  return {
    reference: payload?.orderId || payload?.transactionId || payload?.id || null,
    checkoutUrl: payload?.checkoutUrl || payload?.redirectUrl || null,
    status: payload?.status || "pending",
  };
};

const createJazzCashPayment = async ({ amount, currency, metadata }) => {
  const baseUrl = sanitizeBaseUrl(process.env.JAZZCASH_API_URL);
  const merchantId = process.env.JAZZCASH_MERCHANT_ID;
  const password = process.env.JAZZCASH_PASSWORD;
  const apiKey = process.env.JAZZCASH_API_KEY;

  if (!baseUrl || !merchantId || !password) {
    throw new IntegrationError(
      "JazzCash credentials are not configured. Set JAZZCASH_API_URL, JAZZCASH_MERCHANT_ID, and JAZZCASH_PASSWORD.",
      500,
    );
  }

  const headers = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["X-API-KEY"] = apiKey;
  }

  const response = await fetch(`${baseUrl}/payments`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      amount,
      currency,
      merchantId,
      password,
      metadata,
    }),
  });

  const payload = await parseJsonFromResponse(response);
  if (!response.ok) {
    const message = payload?.message || "JazzCash payment request failed.";
    throw new IntegrationError(message, response.status);
  }

  return {
    reference: payload?.pp_TxnRefNo || payload?.transactionId || payload?.id || null,
    checkoutUrl: payload?.paymentUrl || payload?.redirectUrl || null,
    status: payload?.status || "pending",
  };
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency = "PKR", provider, metadata = {} } = body || {};

    if (!provider) {
      throw new IntegrationError("Payment provider is required.");
    }

    const normalizedProvider = String(provider).toLowerCase();
    const normalizedAmount = normalizeAmount(amount);
    const normalizedCurrency = normalizeCurrency(currency);

    let result;
    if (normalizedProvider === "stripe") {
      result = await createStripeCheckoutSession({
        amount: normalizedAmount,
        currency: normalizedCurrency,
        metadata,
      });
    } else if (normalizedProvider === "easypaisa") {
      result = await createEasyPaisaPayment({
        amount: normalizedAmount,
        currency: normalizedCurrency,
        metadata,
      });
    } else if (normalizedProvider === "jazzcash") {
      result = await createJazzCashPayment({
        amount: normalizedAmount,
        currency: normalizedCurrency,
        metadata,
      });
    } else {
      throw new IntegrationError(`Unsupported payment provider: ${normalizedProvider}.`);
    }

    return NextResponse.json({
      success: true,
      provider: normalizedProvider,
      amount: normalizedAmount,
      currency: normalizedCurrency,
      ...result,
    });
  } catch (error) {
    if (error instanceof IntegrationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }

    console.error("Payment checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to create payment. Check server logs for details." },
      { status: 500 },
    );
  }
}
