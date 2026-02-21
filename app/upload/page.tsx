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
      
// Handle potential JSON parsing errors
let data;
try {
  const text = await res.text();
  data = text ? JSON.parse(text) : {};
} catch (jsonError) {
  console.error("JSON parsing error:", jsonError);
  throw new Error("Invalid response from server. Please try again.");
}

      if (!res.ok) throw new Error(data?.error || "Upload failed.");

      setStatus("success");
      sessionStorage.removeItem("six_second_test_session_id");
    } catch (err: Error | unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  // IMPORTANT: wait until we've checked URL + storage
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
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-semibold mb-4 animate-fade-in">You&apos;re all set.</h2>
            <p className="mt-2 text-slate-700">
              Your resume has been received.
            </p>
            <p className="mt-2 text-slate-700">
              I&apos;ll personally review it and send your 6-Second Test report within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-slate-600">
              Payment confirmed. Upload your resume (PDF) below and we&apos;ll send your report within 24 hours.
            </p>
            
            <p className="mb-8 text-sm text-slate-500">
              This is a beta release. Reports are personally reviewed and delivered within 24 hours.
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
                <button
                  type="button"
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-slate-800 font-medium hover:bg-slate-200 transition"
                >
                  Upload Resume (PDF)
                </button>
                <input
                  id="file-input"
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => {
                    if (e.target.files) setFile(e.target.files[0]);
                  }}
                  className="hidden"
                />
                {file && (
                  <p className="mt-2 text-sm text-slate-600">
                    Selected file: {file.name}
                  </p>
                )}
              </div>

              {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === "uploading"}
                className="rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-slate-800 hover:transform hover:translate-y-[-2px] hover:shadow-md active:translate-y-0 duration-200 cursor-pointer disabled:opacity-60 disabled:hover:transform-none"
              >
                {status === "uploading" ? "Submitting..." : "Run the 6-Second Test"}
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
