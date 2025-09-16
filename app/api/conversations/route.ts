import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data/conversations.json");

// Helper: read conversations
async function readConversations() {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

// Helper: write conversations
async function writeConversations(conversations: any[]) {
  await fs.writeFile(filePath, JSON.stringify(conversations, null, 2));
}

// GET → Fetch conversation by ID
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id query param required" },
        { status: 400 }
      );
    }

    const conversations = await readConversations();
    const conversation = conversations.find((c: any) => c.id === id);

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load conversation" }, { status: 500 });
  }
}

// POST → Create a new conversation
export async function POST(req: Request) {
  try {
    const { campaignId, creatorName } = await req.json();

    if (!campaignId || !creatorName) {
      return NextResponse.json(
        { error: "campaignId and creatorName are required" },
        { status: 400 }
      );
    }

    const conversations = await readConversations();

    const newConversation = {
      id: Date.now().toString(),
      campaignId,
      creatorName,
      status: "pending", // chat disabled until creator accepts
      createdAt: new Date().toISOString(),
    };

    conversations.push(newConversation);
    await writeConversations(conversations);

    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save conversation" }, { status: 500 });
  }
}

// PATCH → Update conversation (e.g., accept/reject)
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    const conversations = await readConversations();
    const idx = conversations.findIndex((c: any) => c.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    conversations[idx].status = status;
    await writeConversations(conversations);

    return NextResponse.json(conversations[idx]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 });
  }
}
