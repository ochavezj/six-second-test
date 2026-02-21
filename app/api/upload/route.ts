import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Configure API route
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}

export async function POST(req: Request) {
  // Add CORS headers for POST requests too
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  };
  try {
    // Parse form data
    const form = await req.formData();
    const sessionId = form.get("session_id")?.toString() || "";
    const email = form.get("email")?.toString() || "";
    const file = form.get("file");

    // Basic validation
    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id. Please complete payment first." },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Resume file is required." },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB limit." },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Verify Stripe payment
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Server configuration error: Missing Stripe key." },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not verified." },
        { 
          status: 403,
          headers: corsHeaders
        }
      );
    }

    // Upload to Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error: Missing Supabase credentials." },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Create unique filename
    const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 60);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const path = `${timestamp}__${safeEmail}__${sessionId}.pdf`;

    // Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(path, fileBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    // Increment the submission counter
    const { error: incrementError } = await supabase.rpc('increment_submission_count');
    
    if (incrementError) {
      console.error("Error incrementing submission count:", incrementError);
      // Continue anyway, as the upload was successful
    }

    // Return success response
    return NextResponse.json({
      ok: true,
      message: "Upload received",
      storage_path: path,
      email,
      session_id: sessionId,
    }, {
      headers: corsHeaders
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
