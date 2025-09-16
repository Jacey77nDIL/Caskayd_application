import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data/messages.json");

// GET → Fetch messages for a conversation
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId query param required" },
        { status: 400 }
      );
    }

    const data = await fs.readFile(filePath, "utf8");
    const messages = JSON.parse(data);

    const filtered = messages.filter(
      (m: any) => m.conversationId === conversationId
    );

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}

// POST → Add a new message
export async function POST(req: Request) {
  try {
    const newMessage = await req.json();

    if (!newMessage.conversationId || !newMessage.sender || !newMessage.text) {
      return NextResponse.json(
        { error: "conversationId, sender, and text are required" },
        { status: 400 }
      );
    }

    const data = await fs.readFile(filePath, "utf8");
    const messages = JSON.parse(data);

    const messageWithId = {
      id: Date.now(),
      conversationId: newMessage.conversationId,
      sender: newMessage.sender,
      text: newMessage.text,
      timestamp: new Date().toISOString(),
    };

    messages.push(messageWithId);

    await fs.writeFile(filePath, JSON.stringify(messages, null, 2));

    return NextResponse.json(messageWithId, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
