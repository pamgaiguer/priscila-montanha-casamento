import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { getDatabase } from "@/lib/firebase-admin";

type ContributionItem = { id: number; name: string; price: number };

const environment = process.env.APP_ENV === "test" ? "test" : "production";
const contributions = () => getDatabase().collection(environment === "test" ? "contributions_test" : "contributions");

export async function createContribution(input: {
  reference: string;
  payerEmail: string;
  items: ContributionItem[];
}) {
  await contributions().doc(input.reference).create({
    environment,
    payerEmail: input.payerEmail,
    items: input.items,
    totalInCents: input.items.reduce((total, item) => total + item.price, 0),
    status: "creating_preference",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function markPreferenceCreated(reference: string, preferenceId?: string) {
  await contributions().doc(reference).set({
    preferenceId: preferenceId ?? null,
    status: "pending",
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
}

export async function markPreferenceFailed(reference: string) {
  await contributions().doc(reference).set({
    status: "preference_failed",
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
}

export async function updateContributionPayment(reference: string, payment: {
  id?: number;
  status?: string;
  statusDetail?: string;
  paymentMethodId?: string;
  transactionAmount?: number;
  dateApproved?: string;
}) {
  await contributions().doc(reference).set({
    mercadoPagoPaymentId: payment.id ?? null,
    status: payment.status ?? "unknown",
    statusDetail: payment.statusDetail ?? null,
    paymentMethodId: payment.paymentMethodId ?? null,
    transactionAmount: payment.transactionAmount ?? null,
    dateApproved: payment.dateApproved ?? null,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
}
