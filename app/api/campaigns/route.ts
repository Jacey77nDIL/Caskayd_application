import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data/campaigns.json");

// GET → Fetch all campaigns
export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const campaigns = JSON.parse(data);
    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load campaigns" }, { status: 500 });
  }
}

// POST → Add a new campaign
export async function POST(req: Request) {
  try {
    const newCampaign = await req.json();

    const data = await fs.readFile(filePath, "utf8");
    const campaigns = JSON.parse(data);

    const campaignWithId = { id: Date.now(), ...newCampaign };
    campaigns.push(campaignWithId);

    await fs.writeFile(filePath, JSON.stringify(campaigns, null, 2));

    return NextResponse.json(campaignWithId, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save campaign" }, { status: 500 });
  }
}

// DELETE → Remove a campaign by ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const data = await fs.readFile(filePath, "utf8");
    let campaigns = JSON.parse(data);

    campaigns = campaigns.filter((c: any) => c.id !== id);

    await fs.writeFile(filePath, JSON.stringify(campaigns, null, 2));

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}
