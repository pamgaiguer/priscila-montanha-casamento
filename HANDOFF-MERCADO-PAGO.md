# Handoff — Checkout Mercado Pago

Status: **código pronto e validado localmente; credenciais expostas já rotacionadas. Falta configurar o ambiente de produção (`.env.montanha.local`, Vercel, webhook) e publicar.**

## O que já existe (implementado)

| Componente | Arquivo |
|---|---|
| Cliente Mercado Pago (Preference + Payment) | `lib/mercado-pago.ts` |
| Criação da preferência de pagamento | `app/api/checkout/route.ts` |
| Webhook de confirmação de pagamento | `app/api/webhooks/mercado-pago/route.ts` |
| Persistência das contribuições no Firestore | `lib/contributions.ts` |
| Lista de presentes e regras de preço | `lib/gifts.ts` |
| Página de retorno do pagamento | `app/pagamento/page.tsx` |
| Fluxo de carrinho/checkout no front | `app/page.tsx` |

Presentes "reais" (`kind: "real"`) têm preço fixo. Presentes "simbólicos" têm valor livre com mínimo de R$ 75,00 (`MIN_PLAYFUL_GIFT_PRICE`). Existem 2 presentes de teste (`id 39` e `40`, R$ 0,50 mínimo) escondidos por trás da flag `TEST_CHECKOUT_ENABLED` em `lib/gifts.ts` — **hoje está `false`** (correto para produção).

## O que foi validado (teste ponta a ponta, ambiente local)

Com um Access Token de **produção** do Mercado Pago (não havia credencial de sandbox disponível), foi feito um pagamento real de R$ 0,50 usando um dos presentes de teste:

1. Front → `POST /api/checkout` → preferência criada com sucesso.
2. Redirecionamento para o checkout do Mercado Pago → pagamento aprovado (`status: approved`, cartão de teste próprio).
3. Webhook (simulado manualmente com assinatura HMAC válida, já que `localhost` não recebe chamadas públicas) → atualizou corretamente o documento no Firestore (`contributions_test`) para `status: approved`, com `mercadoPagoPaymentId`, `dateApproved`, `transactionAmount` etc.

**O webhook real (disparado automaticamente pelo Mercado Pago) ainda não foi testado**, pois isso só é possível com um domínio público em produção.

## Correções de segurança aplicadas nesta sessão

1. **`app/api/webhooks/mercado-pago/route.ts`** — antes, se `MERCADO_PAGO_WEBHOOK_SECRET` não estivesse configurada, o webhook aceitava qualquer notificação sem checar assinatura (falha aberta). Agora **rejeita** (`401`) nesse caso.
2. **`app/api/checkout/route.ts`** — antes, se `NEXT_PUBLIC_SITE_URL` não estivesse configurada, o app derivava a URL base do header `Host` da requisição (potencialmente manipulável). Agora, em `APP_ENV=production`, a ausência dessa variável lança erro em vez de usar esse fallback. Em dev/test local o fallback continua existindo.
   - Também corrigido: `auto_return: "approved"` só é enviado ao Mercado Pago quando a URL é HTTPS pública — o Mercado Pago rejeita esse campo com `back_urls` em `localhost` (erro `invalid_auto_return`).

Essas mudanças estão **commitadas apenas localmente** (não commitadas ainda) — ver `git status` / `git diff` antes de prosseguir.

## ✅ Credenciais rotacionadas

As credenciais que haviam passado pelo chat de um assistente de IA durante a configuração (e por isso tratadas como potencialmente expostas) já foram rotacionadas:

- `MERCADO_PAGO_ACCESS_TOKEN` de produção — novo token gerado, antigo invalidado.
- `MERCADO_PAGO_WEBHOOK_SECRET` — nova assinatura gerada no painel do Mercado Pago.
- Chave de conta de serviço do Firebase Admin SDK (`FIREBASE_SERVICE_ACCOUNT_JSON`) — confirmada/rotacionada no Firebase Console.

Os arquivos `.env.local` e `.env.pam-test.local` usados durante o teste foram apagados propositalmente (continham as credenciais antigas expostas). **Não existe nenhum `.env*` no projeto agora** — o próximo passo exige criar `.env.pam-test.local` (perfil de teste) e/ou `.env.montanha.local` (perfil de produção) do zero, com os valores novos já rotacionados. Nenhum dos dois é versionado no git (ver `.gitignore`).

## Passo a passo para concluir

1. ~~Rotacionar as 3 credenciais~~ ✅ feito — ver seção acima.
2. (Opcional) Recriar `.env.pam-test.local` com os valores novos das credenciais rotacionadas, caso precise testar em local de novo — veja o formato esperado em `scripts/use-env.mjs`.
3. Criar `.env.montanha.local` com as credenciais de produção (as mesmas já rotacionadas):
   ```
   MERCADO_PAGO_ACCESS_TOKEN=<token de produção>
   MERCADO_PAGO_WEBHOOK_SECRET=<assinatura do webhook de produção>
   FIREBASE_SERVICE_ACCOUNT_JSON=<json em uma linha só>
   APP_ENV=production
   NEXT_PUBLIC_SITE_URL=https://<domínio real do site>
   ```
   (`MERCADO_PAGO_USE_SANDBOX` deve ficar ausente ou `false` em produção.)
4. Configurar as mesmas variáveis de ambiente no projeto da **Vercel** (Production).
5. No painel do Mercado Pago (conta de produção): cadastrar o webhook apontando para `https://<domínio>/api/webhooks/mercado-pago`, tópico `payment`. Copiar a assinatura secreta gerada para `MERCADO_PAGO_WEBHOOK_SECRET`.
6. Fazer deploy.
7. Testar com um pagamento real de valor baixo (pode habilitar `TEST_CHECKOUT_ENABLED = true` temporariamente em `lib/gifts.ts` pra isso, revertendo depois) e confirmar que o webhook real do Mercado Pago atualiza o Firestore automaticamente (sem precisar simular).
8. Reverter `TEST_CHECKOUT_ENABLED` para `false` antes de divulgar o site pros convidados. Considerar remover os itens `id 39` e `40` de `lib/gifts.ts` de vez.
9. Revisar e commitar as mudanças de segurança listadas acima (`app/api/checkout/route.ts`, `app/api/webhooks/mercado-pago/route.ts`).

## Comandos úteis

```bash
npm run env:test        # ativa .env.pam-test.local → .env.local
npm run env:production  # ativa .env.montanha.local → .env.local
npm run dev
npm run lint
npm run build
```
