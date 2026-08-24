import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { createContribution, markPreferenceCreated, markPreferenceFailed } from "@/lib/contributions";
import { giftItems, isRealGift, isTestGift, MIN_PLAYFUL_GIFT_PRICE, MIN_TEST_GIFT_PRICE } from "@/lib/gifts";
import { getMercadoPagoPreference } from "@/lib/mercado-pago";

export const runtime = "nodejs";

function siteUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") throw new Error("Requisição inválida.");

    const { giftIds, giftAmounts, payerEmail } = body as { giftIds?: unknown; giftAmounts?: unknown; payerEmail?: unknown };
    if (!Array.isArray(giftIds) || giftIds.length === 0 || giftIds.length > giftItems.length) {
      return NextResponse.json({ error: "Selecione ao menos um presente." }, { status: 400 });
    }

    const uniqueIds = [...new Set(giftIds)];
    if (!uniqueIds.every((id): id is number => Number.isInteger(id))) {
      return NextResponse.json({ error: "A seleção de presentes é inválida." }, { status: 400 });
    }

    const gifts = uniqueIds.map((id) => giftItems.find((gift) => gift.id === id));
    if (gifts.some((gift) => !gift)) {
      return NextResponse.json({ error: "Um dos presentes não existe." }, { status: 400 });
    }

    const amounts = giftAmounts && typeof giftAmounts === "object"
      ? giftAmounts as Record<string, unknown>
      : {};
    const pricedGifts = gifts.map((gift) => {
      if (isRealGift(gift!.id) && !isTestGift(gift!.id)) return gift!;
      const customPrice = amounts[String(gift!.id)];
      const minimum = isTestGift(gift!.id) ? MIN_TEST_GIFT_PRICE : MIN_PLAYFUL_GIFT_PRICE;
      if (!Number.isSafeInteger(customPrice) || (customPrice as number) < minimum) return null;
      return { ...gift!, price: customPrice as number };
    });
    if (pricedGifts.some((gift) => !gift)) {
      return NextResponse.json({ error: "Confira o valor mínimo permitido para cada presente." }, { status: 400 });
    }

    const email = typeof payerEmail === "string" ? payerEmail.trim().toLowerCase() : "";
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }

    const baseUrl = siteUrl(request);
    const isPublicHttps = baseUrl.startsWith("https://") && !baseUrl.includes("localhost");
    const reference = `gift-${randomUUID()}`;
    await createContribution({
      reference,
      payerEmail: email,
      items: pricedGifts.map((gift) => ({ id: gift!.id, name: gift!.name, price: gift!.price })),
    });

    try {
      const preference = await getMercadoPagoPreference().create({
        body: {
          items: pricedGifts.map((gift) => ({
            id: String(gift!.id),
            title: `Site-Presente: ${gift!.name}`,
            description: `Site-Presente: ${gift!.name}`,
            quantity: 1,
            currency_id: "BRL",
            unit_price: gift!.price / 100,
          })),
          payer: { email },
          external_reference: reference,
          statement_descriptor: "PRISCILA MONT",
          back_urls: {
            success: `${baseUrl}/pagamento?status=success`,
            pending: `${baseUrl}/pagamento?status=pending`,
            failure: `${baseUrl}/pagamento?status=failure`,
          },
          auto_return: "approved",
          ...(isPublicHttps ? { notification_url: `${baseUrl}/api/webhooks/mercado-pago` } : {}),
          metadata: { gift_ids: uniqueIds.join(",") },
        },
        requestOptions: { idempotencyKey: reference },
      });

      const checkoutUrl = process.env.MERCADO_PAGO_USE_SANDBOX === "true"
        ? preference.sandbox_init_point
        : preference.init_point;

      if (!checkoutUrl) throw new Error("O Mercado Pago não retornou a URL do checkout.");
      await markPreferenceCreated(reference, preference.id);
      return NextResponse.json({ checkoutUrl });
    } catch (error) {
      await markPreferenceFailed(reference).catch(() => undefined);
      throw error;
    }
  } catch (error) {
    console.error("Falha ao criar preferência do Mercado Pago", error);
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, { status: 500 });
  }
}
