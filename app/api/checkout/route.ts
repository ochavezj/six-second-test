import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  console.log("BASE URL =", baseUrl);
  console.log("INTENDED SUCCESS URL =", `${baseUrl}/upload?session_id={CHECKOUT_SESSION_ID}`);

  if (!secretKey || !priceId || !baseUrl) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY, STRIPE_PRICE_ID, or NEXT_PUBLIC_BASE_URL" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/upload?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/?canceled=1`,
  });

  console.log("STRIPE SESSION ID =", session.id);
  // @ts-ignore (Stripe types vary a bit)
  console.log("STRIPE SUCCESS URL =", (session as any).success_url);

  return NextResponse.redirect(session.url as string, { status: 303 });
}



