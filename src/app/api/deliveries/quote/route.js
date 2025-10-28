import { NextResponse } from "next/server";

export const runtime = "nodejs";

class IntegrationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const sanitizeBaseUrl = (url) => url?.replace(/\/+$/, "") ?? "";

const normalizeWeight = (weight) => {
  const value = Number(weight);
  if (!Number.isFinite(value) || value <= 0) {
    throw new IntegrationError("Weight must be greater than zero.");
  }
  return value;
};

const ensureString = (value, field) => {
  if (!value || typeof value !== "string" || value.trim().length === 0) {
    throw new IntegrationError(`${field} is required.`);
  }
  return value.trim();
};

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const requestTcsQuote = async ({ weight, origin, destination, metadata }) => {
  const baseUrl = sanitizeBaseUrl(process.env.TCS_API_URL);
  const apiKey = process.env.TCS_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new IntegrationError(
      "TCS credentials are not configured. Set TCS_API_URL and TCS_API_KEY.",
      500,
    );
  }

  const response = await fetch(`${baseUrl}/rates/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      weight,
      origin,
      destination,
      metadata,
    }),
  });

  const payload = await parseJson(response);
  if (!response.ok) {
    const message = payload?.message || "TCS quote request failed.";
    throw new IntegrationError(message, response.status);
  }

  return {
    reference: payload?.reference || payload?.bookingNumber || null,
    cost: payload?.totalAmount || payload?.charges || null,
    transitTime: payload?.transitTime || payload?.estimatedDelivery || null,
    provider: "tcs",
  };
};

const requestLeopardsQuote = async ({ weight, origin, destination, metadata }) => {
  const baseUrl = sanitizeBaseUrl(process.env.LEOPARDS_API_URL);
  const apiKey = process.env.LEOPARDS_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new IntegrationError(
      "Leopards credentials are not configured. Set LEOPARDS_API_URL and LEOPARDS_API_KEY.",
      500,
    );
  }

  const response = await fetch(`${baseUrl}/rates/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({
      weight,
      origin,
      destination,
      metadata,
    }),
  });

  const payload = await parseJson(response);
  if (!response.ok) {
    const message = payload?.message || "Leopards quote request failed.";
    throw new IntegrationError(message, response.status);
  }

  return {
    reference: payload?.trackingNumber || payload?.reference || null,
    cost: payload?.total || payload?.charges || null,
    transitTime: payload?.eta || payload?.transitTime || null,
    provider: "leopards",
  };
};

const requestMnpQuote = async ({ weight, origin, destination, metadata }) => {
  const baseUrl = sanitizeBaseUrl(process.env.MNP_API_URL);
  const apiKey = process.env.MNP_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new IntegrationError(
      "M&P credentials are not configured. Set MNP_API_URL and MNP_API_KEY.",
      500,
    );
  }

  const response = await fetch(`${baseUrl}/rates/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      weight,
      origin,
      destination,
      metadata,
    }),
  });

  const payload = await parseJson(response);
  if (!response.ok) {
    const message = payload?.message || "M&P quote request failed.";
    throw new IntegrationError(message, response.status);
  }

  return {
    reference: payload?.cnNumber || payload?.reference || null,
    cost: payload?.charges || payload?.amount || null,
    transitTime: payload?.transitTime || payload?.eta || null,
    provider: "mnp",
  };
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { provider, weight, origin, destination, metadata = {} } = body || {};

    if (!provider) {
      throw new IntegrationError("Delivery provider is required.");
    }

    const normalizedProvider = String(provider).toLowerCase();
    const normalizedWeight = normalizeWeight(weight);
    const pickup = ensureString(origin, "Pickup area");
    const dropoff = ensureString(destination, "Delivery area");

    let result;
    if (normalizedProvider === "tcs") {
      result = await requestTcsQuote({
        weight: normalizedWeight,
        origin: pickup,
        destination: dropoff,
        metadata,
      });
    } else if (normalizedProvider === "leopards") {
      result = await requestLeopardsQuote({
        weight: normalizedWeight,
        origin: pickup,
        destination: dropoff,
        metadata,
      });
    } else if (normalizedProvider === "mnp") {
      result = await requestMnpQuote({
        weight: normalizedWeight,
        origin: pickup,
        destination: dropoff,
        metadata,
      });
    } else {
      throw new IntegrationError(`Unsupported delivery provider: ${normalizedProvider}.`);
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof IntegrationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }

    console.error("Delivery quote error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to fetch delivery quote. Check server logs for details." },
      { status: 500 },
    );
  }
}
