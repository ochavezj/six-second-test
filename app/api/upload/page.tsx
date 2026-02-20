"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function UploadInner() {
  const searchParams = useSearchParams();
  const sessionFromUrl = searchParams.get("session_id") || "";

  const [ready, setReady] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // If URL has session_id, store it
    if (sessionFromUrl) {
      sessionStorage.setItem("six_second_test_session_id", sessionFromUrl);
      setSessionId(sessionFromUrl);
      setReady(true);
      return;
    }

    // Otherwise recover from sessionStorage (if the URL got stripped)
    const saved = sessionStorage.getItem("six_second_test_session_id") || "";
    setSessionId(saved);
    setReady(true);
  }, [sessionFromUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("uploading");
    setErrorMsg("");

    try {
      if (!sessionId) throw new Error("Missing session. Please complete payment again.");
      if (!file) throw new Error("Please choose a PDF file.");

      const fd = new FormData();
      fd.append("session_id", sessionId);
      fd.append("email", email);
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Upload failed.");

      setStatus("success");
      sessionStorage.removeItem("six_second_test_session_id");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong.");
    }
  }

  // IMPORTANT: wait until we’ve checked URL + storage
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-slate-600">Loading…</p>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-600">Invalid session. Please complete payment first.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold mb-6">Upload Your Resume</h1>

        {status === "success" ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold">You’re all set ✅</h2>
            <p className="mt-2 text-slate-700">
              We received your resume. You’ll get your 6-Second Test report within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-8 text-slate-600">
              Payment confirmed. Upload your resume (PDF) below and we’ll send your report within 24 hours.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Resume (PDF only)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => {
                    if (e.target.files) setFile(e.target.files[0]);
                  }}
                  className="w-full"
                />
              </div>

              {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === "uploading"}
                className="rounded-xl bg-slate-900 px-6 py-3 text-white disabled:opacity-60"
              >
                {status === "uploading" ? "Submitting..." : "Submit Resume"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <UploadInner />
    </Suspense>
  );
}



