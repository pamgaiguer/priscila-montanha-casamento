import { copyFileSync, readFileSync } from "node:fs";

const requested = process.argv[2];
const profiles = {
  test: ".env.pam-test.local",
  production: ".env.montanha.local",
};
const source = profiles[requested];

if (!source) throw new Error("Use test ou production.");

const contents = readFileSync(source, "utf8");
for (const key of ["MERCADO_PAGO_ACCESS_TOKEN", "MERCADO_PAGO_WEBHOOK_SECRET", "FIREBASE_SERVICE_ACCOUNT_JSON"]) {
  const value = contents.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1]?.trim();
  if (!value) throw new Error(`${key} não foi configurada em ${source}.`);
}

copyFileSync(source, ".env.local");
console.log(`Ambiente ativo: ${requested}`);
