import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Configure API route
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase credentials" },
        { status: 500 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if the submissions_count table exists
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
    const limitReached = currentCount >= BETA_SUBMISSION_LIMIT;

    return NextResponse.json({
      count: currentCount,
      limit: BETA_SUBMISSION_LIMIT,
      limitReached: limitReached,
      remaining: Math.max(0, BETA_SUBMISSION_LIMIT - currentCount)
    });
  } catch (err) {
    console.error("Error checking submission count:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
