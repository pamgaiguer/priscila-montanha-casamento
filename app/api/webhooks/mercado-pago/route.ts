import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { updateContributionPayment } from "@/lib/contributions";
import { getMercadoPagoPayment } from "@/lib/mercado-pago";

export const runtime = "nodejs";

function validSignature(request: Request, dataId: string) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("MERCADO_PAGO_WEBHOOK_SECRET não configurada — rejeitando notificação.");
    return false;
  }

  const signature = request.headers.get("x-signature") ?? "";
  const requestId = request.headers.get("x-request-id") ?? "";
  const parts = Object.fromEntries(signature.split(",").map((part) => part.trim().split("=")));
  if (!parts.ts || !parts.v1 || !requestId) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const received = Buffer.from(parts.v1);
  const calculated = Buffer.from(expected);
  return received.length === calculated.length && timingSafeEqual(received, calculated);
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const payload = await request.json().catch(() => ({})) as { type?: string; data?: { id?: string | number } };
    const dataId = String(payload.data?.id ?? url.searchParams.get("data.id") ?? "");
    const type = payload.type ?? url.searchParams.get("type");

    if (!dataId || !validSignature(request, dataId)) {
      return NextResponse.json({ error: "Notificação inválida." }, { status: 401 });
    }

    if (type === "payment") {
      const payment = await getMercadoPagoPayment().get({ id: dataId });
      const reference = payment.external_reference ?? "";
      if (/^gift-[0-9a-f-]{36}$/i.test(reference)) {
        await updateContributionPayment(reference, {
          id: payment.id,
          status: payment.status,
          statusDetail: payment.status_detail,
          paymentMethodId: payment.payment_method_id,
          transactionAmount: payment.transaction_amount,
          dateApproved: payment.date_approved,
        });
      }
      console.info("Pagamento Mercado Pago atualizado", {
        id: payment.id,
        status: payment.status,
        externalReference: reference,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Falha ao processar Webhook do Mercado Pago", error);
    return NextResponse.json({ error: "Falha ao processar notificação." }, { status: 500 });
  }
}
