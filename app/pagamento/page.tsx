import Link from "next/link";

const messages = {
  success: ["Pagamento aprovado", "Muito obrigado pelo carinho! A contribuição foi recebida."],
  pending: ["Pagamento em processamento", "O Mercado Pago ainda está processando a contribuição. Avisaremos assim que houver uma atualização."],
  failure: ["Pagamento não concluído", "A contribuição não foi cobrada. Você pode voltar e tentar novamente."],
} as const;

export default async function PaymentResult({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const result = messages[status as keyof typeof messages] ?? messages.pending;

  return <main className="paymentResult"><section><p className="eyebrow">P &amp; M</p><h1>{result[0]}</h1><p>{result[1]}</p><Link href="/#presentes">VOLTAR À LISTA DE PRESENTES</Link></section></main>;
}
