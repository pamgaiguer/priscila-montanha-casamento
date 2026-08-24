import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function credentials() {
  const fromEnvironment = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (fromEnvironment) return cert(JSON.parse(fromEnvironment) as ServiceAccount);

  const localFile = "firebase-service-account.json";
  if (existsSync(localFile)) {
    return cert(JSON.parse(readFileSync(localFile, "utf8")) as ServiceAccount);
  }

  return undefined;
}

function getFirebaseApp() {
  if (getApps().length) return getApps()[0]!;

  const credential = credentials();
  return initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID ?? "pri-montanha-2026",
    ...(credential ? { credential } : {}),
  });
}

export function getDatabase() {
  return getFirestore(getFirebaseApp());
}
