"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function UploadPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">
          Invalid session. Please complete payment first.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold mb-6">
          Upload Your Resume
        </h1>

        <p className="mb-8 text-slate-600">
          Payment confirmed. Upload your resume (PDF) below and we’ll send your
          6-Second Test report within 24 hours.
        </p>

        <form className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Resume (PDF only)
            </label>
            <input
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-6 py-3 text-white"
          >
            Submit Resume
          </button>
        </form>
      </div>
    </main>
  );
}
