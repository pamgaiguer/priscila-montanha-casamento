import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { getDatabase } from "@/lib/firebase-admin";

const environment = process.env.APP_ENV === "test" ? "test" : "production";
const messages = () => getDatabase().collection(environment === "test" ? "messages_test" : "messages");

export type PublicMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export async function createMessage(input: { name: string; message: string }) {
  const document = await messages().add({
    name: input.name,
    message: input.message,
    published: true,
    createdAt: FieldValue.serverTimestamp(),
  });

  return document.id;
}

export async function listMessages(limit = 20): Promise<PublicMessage[]> {
  const snapshot = await messages()
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((document) => {
    const data = document.data();
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
    return {
      id: document.id,
      name: String(data.name),
      message: String(data.message),
      createdAt: createdAt.toISOString(),
    };
  });
}
