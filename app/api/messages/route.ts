import { NextResponse } from "next/server";

import { createMessage, listMessages } from "@/lib/messages";

export async function GET() {
  try {
    return NextResponse.json({ messages: await listMessages() });
  } catch (error) {
    console.error("Could not list messages", error);
    return NextResponse.json({ error: "Não foi possível carregar os recados." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: unknown; message?: unknown; website?: unknown };
    const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
    const message = typeof body.message === "string" ? body.message.trim().replace(/\s+/g, " ") : "";

    // Bots commonly fill hidden website fields; return success without storing those submissions.
    if (body.website) return NextResponse.json({ id: "ignored", name, message, createdAt: new Date().toISOString() }, { status: 201 });
    if (name.length < 2 || name.length > 80) {
      return NextResponse.json({ error: "Informe um nome entre 2 e 80 caracteres." }, { status: 400 });
    }
    if (message.length < 3 || message.length > 1000) {
      return NextResponse.json({ error: "O recado deve ter entre 3 e 1.000 caracteres." }, { status: 400 });
    }

    const id = await createMessage({ name, message });
    return NextResponse.json({ id, name, message, createdAt: new Date().toISOString() }, { status: 201 });
  } catch (error) {
    console.error("Could not create message", error);
    return NextResponse.json({ error: "Não foi possível enviar seu recado." }, { status: 500 });
  }
}
