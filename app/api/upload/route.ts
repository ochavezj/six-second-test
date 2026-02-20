import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const sessionId = form.get("session_id")?.toString() || "";
    const email = form.get("email")?.toString() || "";
    const file = form.get("file");

    if (!sessionId || !email || !file) {
      return NextResponse.json(
        { error: "Missing session_id, email, or file" },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // 1) Verify Stripe payment
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Ensure it's a paid session
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not verified" },
        { status: 403 }
      );
    }

    // 2) Upload to Supabase Storage (private bucket)
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Nice, unique-ish filename
    const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 60);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const path = `${timestamp}__${safeEmail}__${sessionId}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(path, fileBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Return a reference you can use later
    return NextResponse.json({
      ok: true,
      message: "Upload received",
      storage_path: path,
      email,
      session_id: sessionId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
