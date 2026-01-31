import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.emailSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json({ message: "Already subscribed" });
      } else {
        // Reactivate
        await prisma.emailSubscriber.update({
          where: { email },
          data: { subscribed: true }
        });
        return NextResponse.json({ success: true, message: "Welcome back!" });
      }
    }

    // Create subscriber
    await prisma.emailSubscriber.create({
      data: {
        email,
        name,
        subscribed: true,
        topics: ['updates', 'news'], // Default topics
      }
    });

    // Send email (fire and forget to avoid blocking)
    sendWelcomeEmail(email, name);

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
