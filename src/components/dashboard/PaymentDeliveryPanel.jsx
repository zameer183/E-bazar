"use client";

import { useState } from "react";
import { PAYMENT_PROVIDERS, createPaymentLink } from "@/lib/payments";
import { DELIVERY_PROVIDERS, requestDeliveryQuote } from "@/lib/deliveries";
import { useI18n } from "@/lib/i18n";
import styles from "./PaymentDeliveryPanel.module.css";

export default function PaymentDeliveryPanel({ shop }) {
  const { t } = useI18n();
  const [paymentProvider, setPaymentProvider] = useState(PAYMENT_PROVIDERS[0]?.value || "easypaisa");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const [paymentOutcome, setPaymentOutcome] = useState(null);
  const [paymentError, setPaymentError] = useState("");

  const [deliveryProvider, setDeliveryProvider] = useState(DELIVERY_PROVIDERS[0]?.value || "tcs");
  const [parcelWeight, setParcelWeight] = useState("");
  const [origin, setOrigin] = useState(shop?.address || "");
  const [destination, setDestination] = useState("");
  const [isDeliverySubmitting, setIsDeliverySubmitting] = useState(false);
  const [deliveryOutcome, setDeliveryOutcome] = useState(null);
  const [deliveryError, setDeliveryError] = useState("");

  const resetPaymentState = () => {
    setPaymentOutcome(null);
    setPaymentError("");
  };

  const resetDeliveryState = () => {
    setDeliveryOutcome(null);
    setDeliveryError("");
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    resetPaymentState();

    const amount = Number(paymentAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setPaymentError(t("dashboard.payments.error"));
      return;
    }

    setIsPaymentSubmitting(true);
    try {
      const response = await createPaymentLink({
        amount,
        currency: "PKR",
        provider: paymentProvider,
        metadata: {
          shopId: shop?.id ?? "",
          shopName: shop?.name ?? "",
        },
      });
      setPaymentOutcome(response);
    } catch (error) {
      setPaymentError(error.message || t("dashboard.payments.error"));
    } finally {
      setIsPaymentSubmitting(false);
    }
  };

  const handleDeliverySubmit = async (event) => {
    event.preventDefault();
    resetDeliveryState();

    const weight = Number(parcelWeight);
    if (!Number.isFinite(weight) || weight <= 0) {
      setDeliveryError(t("dashboard.payments.error"));
      return;
    }

    if (!origin || !destination) {
      setDeliveryError(t("dashboard.payments.error"));
      return;
    }

    setIsDeliverySubmitting(true);
    try {
      const response = await requestDeliveryQuote({
        provider: deliveryProvider,
        weight,
        origin,
        destination,
        metadata: {
          shopId: shop?.id ?? "",
          shopName: shop?.name ?? "",
        },
      });
      setDeliveryOutcome(response);
    } catch (error) {
      setDeliveryError(error.message || t("dashboard.payments.error"));
    } finally {
      setIsDeliverySubmitting(false);
    }
  };

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <h2>{t("dashboard.payments.title")}</h2>
        <p>{t("dashboard.payments.subtitle")}</p>
      </header>

      <div className={styles.grid}>
        <form className={styles.card} onSubmit={handlePaymentSubmit}>
          <h3>{t("dashboard.payments.paymentTitle")}</h3>
          <label className={styles.label} htmlFor="payment-amount">
            {t("dashboard.payments.amount")}
          </label>
          <input
            id="payment-amount"
            type="number"
            min="1"
            step="1"
            value={paymentAmount}
            onChange={(event) => setPaymentAmount(event.target.value)}
            className={styles.input}
          />

          <label className={styles.label} htmlFor="payment-provider">
            {t("dashboard.payments.provider")}
          </label>
          <select
            id="payment-provider"
            value={paymentProvider}
            onChange={(event) => setPaymentProvider(event.target.value)}
            className={styles.select}
          >
            {PAYMENT_PROVIDERS.map((provider) => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>

          {paymentError && <p className={styles.error}>{paymentError}</p>}

          <button type="submit" className={styles.button} disabled={isPaymentSubmitting}>
            {isPaymentSubmitting ? t("dashboard.payments.pending") : t("dashboard.payments.submit")}
          </button>

          {paymentOutcome && (
            <dl className={styles.result}>
              <dt>{t("dashboard.payments.success")}</dt>
              {paymentOutcome.reference && (
                <div className={styles.resultRow}>
                  <span>{t("dashboard.payments.result.reference")}</span>
                  <span>{paymentOutcome.reference}</span>
                </div>
              )}
              {paymentOutcome.amount && (
                <div className={styles.resultRow}>
                  <span>{t("dashboard.payments.result.amount")}</span>
                  <span>{paymentOutcome.amount}</span>
                </div>
              )}
              {paymentOutcome.status && (
                <div className={styles.resultRow}>
                  <span>{t("dashboard.payments.result.status")}</span>
                  <span>{paymentOutcome.status}</span>
                </div>
              )}
              {paymentOutcome.checkoutUrl && (
                <div className={styles.resultRow}>
                  <span>{t("dashboard.payments.result.url")}</span>
                  <a href={paymentOutcome.checkoutUrl} target="_blank" rel="noopener noreferrer">
                    {paymentOutcome.checkoutUrl}
                  </a>
                </div>
              )}
            </dl>
          )}
        </form>

        <form className={styles.card} onSubmit={handleDeliverySubmit}>
          <h3>{t("dashboard.payments.deliveryTitle")}</h3>

          <label className={styles.label} htmlFor="parcel-weight">
            {t("dashboard.payments.weight")}
          </label>
          <input
            id="parcel-weight"
            type="number"
            min="0.1"
            step="0.1"
            value={parcelWeight}
            onChange={(event) => setParcelWeight(event.target.value)}
            className={styles.input}
          />

          <label className={styles.label} htmlFor="parcel-origin">
            {t("dashboard.payments.origin")}
          </label>
          <input
            id="parcel-origin"
            type="text"
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
            className={styles.input}
          />

          <label className={styles.label} htmlFor="parcel-destination">
            {t("dashboard.payments.destination")}
          </label>
          <input
            id="parcel-destination"
            type="text"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            className={styles.input}
          />

          <label className={styles.label} htmlFor="delivery-provider">
            {t("dashboard.payments.deliveryProvider")}
          </label>
          <select
            id="delivery-provider"
            value={deliveryProvider}
            onChange={(event) => setDeliveryProvider(event.target.value)}
            className={styles.select}
          >
            {DELIVERY_PROVIDERS.map((provider) => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>

          {deliveryError && <p className={styles.error}>{deliveryError}</p>}

          <button type="submit" className={styles.button} disabled={isDeliverySubmitting}>
            {isDeliverySubmitting
              ? t("dashboard.payments.deliveryPending")
              : t("dashboard.payments.deliverySubmit")}
          </button>

          {deliveryOutcome && (
            <dl className={styles.result}>
              <dt>{t("dashboard.payments.deliverySuccess")}</dt>
              {deliveryOutcome.reference && (
                <div className={styles.resultRow}>
                  <span>{t("dashboard.payments.result.reference")}</span>
                  <span>{deliveryOutcome.reference}</span>
                </div>
              )}
              {deliveryOutcome.cost && (
                <div className={styles.resultRow}>
                  <span>{t("dashboard.payments.result.estimate")}</span>
                  <span>{deliveryOutcome.cost}</span>
                </div>
              )}
              {deliveryOutcome.transitTime && (
                <div className={styles.resultRow}>
                  <span>{t("dashboard.payments.result.transit")}</span>
                  <span>{deliveryOutcome.transitTime}</span>
                </div>
              )}
              {deliveryOutcome.provider && (
                <div className={styles.resultRow}>
                  <span>{t("dashboard.payments.result.provider")}</span>
                  <span>{deliveryOutcome.provider.toUpperCase()}</span>
                </div>
              )}
            </dl>
          )}
        </form>
      </div>
    </section>
  );
}

