import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "tasks.json");

// GET all tasks
export async function GET() {
  const data = fs.readFileSync(filePath, "utf-8");
  const tasks = JSON.parse(data);
  return NextResponse.json(tasks);
}

// DELETE a task by id
export async function DELETE(req: Request) {
  const { id } = await req.json();

  const data = fs.readFileSync(filePath, "utf-8");
  let tasks = JSON.parse(data);

  tasks = tasks.filter((task: any) => task.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));

  return NextResponse.json({ success: true, tasks });
}
