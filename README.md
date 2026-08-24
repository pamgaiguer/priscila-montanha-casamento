# Site de casamento — Priscila & Montanha

Site do casamento de Priscila e Montanha, desenvolvido com Next.js, React,
TypeScript e Tailwind CSS.

## Requisitos

- Node.js 22
- npm

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Verificação

```bash
npm run lint
npm run build
```

## Publicação na Vercel

Importe o repositório na Vercel. O framework e os comandos são detectados
automaticamente:

- comando de build: `npm run build`
- diretório de saída: padrão do Next.js
- versão do Node.js: 22

## Checkout Pro (Mercado Pago)

Configure o Access Token, a URL pública HTTPS, a assinatura secreta do Webhook e
as credenciais do Firebase em `.env.local`. Nunca exponha ou versione essas
credenciais.

O Webhook deve apontar para `/api/webhooks/mercado-pago` e assinar o tópico
`payment`. Use `MERCADO_PAGO_USE_SANDBOX=true` durante os testes e remova ou
defina como `false` ao usar credenciais de produção.

Os perfis locais ficam em `.env.pam-test.local` e `.env.montanha.local`, ambos
ignorados pelo Git. Use `npm run env:test` ou `npm run env:production` para
selecionar o perfil ativo.
