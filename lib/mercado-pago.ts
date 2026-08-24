import "server-only";

import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

let preferenceClient: Preference | undefined;
let paymentClient: Payment | undefined;

function getClient() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("A variável de ambiente MERCADO_PAGO_ACCESS_TOKEN não foi configurada.");
  }

  return new MercadoPagoConfig({ accessToken });
}

export function getMercadoPagoPreference() {
  if (!preferenceClient) {
    preferenceClient = new Preference(getClient());
  }

  return preferenceClient;
}

export function getMercadoPagoPayment() {
  if (!paymentClient) paymentClient = new Payment(getClient());
  return paymentClient;
}
