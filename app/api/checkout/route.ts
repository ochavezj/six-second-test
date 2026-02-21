import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Maximum number of submissions allowed for beta
const BETA_SUBMISSION_LIMIT = 50;

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("BASE URL =", baseUrl);
    console.log("INTENDED SUCCESS URL =", `${baseUrl}/upload?session_id={CHECKOUT_SESSION_ID}`);

    if (!secretKey || !priceId || !baseUrl) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY, STRIPE_PRICE_ID, or NEXT_PUBLIC_BASE_URL" },
        { status: 500 }
      );
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if we've reached the beta submission limit
    // First, check if the submissions_count table exists
    const { error: tableCheckError } = await supabase
      .from('submissions_count')
      .select('count')
      .limit(1);

    // If table doesn't exist, create it
    if (tableCheckError && tableCheckError.message.includes('does not exist')) {
      // Create the table and initialize count to 0
      await supabase.rpc('create_submissions_table');
    }

    // Get current submission count
    const { data: countData, error: countError } = await supabase
      .from('submissions_count')
      .select('count')
      .eq('id', 1)
      .single();

    if (countError && !countError.message.includes('does not exist')) {
      console.error("Error fetching submission count:", countError);
      return NextResponse.json(
        { error: "Failed to check submission count" },
        { status: 500 }
      );
    }

    const currentCount = countData?.count || 0;

    // Check if we've reached the limit
    if (currentCount >= BETA_SUBMISSION_LIMIT) {
      return NextResponse.json(
        { 
          error: "Beta submission limit reached", 
          message: "We've reached our beta testing limit of 50 submissions. Thank you for your interest! Please check back later when we launch the full version."
        },
        { status: 403 }
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
    console.log("STRIPE SUCCESS URL =", (session as { success_url: string }).success_url);

    return NextResponse.redirect(session.url as string, { status: 303 });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}







