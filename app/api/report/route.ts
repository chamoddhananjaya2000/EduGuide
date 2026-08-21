import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json(null, { status: 200 });
    }
    const db = client.db();
    const report = await db.collection("reports").findOne({ userId });

    // Remove MongoDB native _id property before returning to client if present
    if (report) {
      delete (report as any)._id;
    }

    return NextResponse.json(report || null);
  } catch (e) {
    console.warn("MongoDB GET Warning (falling back to local state):", e);
    return NextResponse.json(null, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, report, history } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ success: true, offline: true }, { status: 200 });
    }
    const db = client.db();

    await db.collection("reports").updateOne(
      { userId },
      { $set: { userId, report, history, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.warn("MongoDB POST Warning (offline fallback):", e);
    return NextResponse.json({ success: false, offline: true }, { status: 200 });
  }
}

