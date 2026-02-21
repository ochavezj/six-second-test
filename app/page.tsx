"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [submissionStatus, setSubmissionStatus] = useState({
    count: 0,
    limit: 50,
    limitReached: false,
    remaining: 50,
    loading: true,
    error: false
  });

  useEffect(() => {
    async function fetchSubmissionCount() {
      try {
        const response = await fetch('/api/submission-count');
        if (!response.ok) {
          throw new Error('Failed to fetch submission count');
        }
        const data = await response.json();
        setSubmissionStatus({
          count: data.count,
          limit: data.limit,
          limitReached: data.limitReached,
          remaining: data.remaining,
          loading: false,
          error: false
        });
      } catch (error) {
        console.error('Error fetching submission count:', error);
        setSubmissionStatus(prev => ({
          ...prev,
          loading: false,
          error: true
        }));
      }
    }

    fetchSubmissionCount();
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            The 6-Second Test™
          </h1>

          <h2 className="text-2xl font-medium text-slate-800">
            A recruiter-calibrated resume audit
          </h2>

          <p className="text-sm text-slate-600">
            By Oscar from LinkedIn
          </p>

          <div className="space-y-4 mt-8">
            <p className="text-xl font-semibold leading-relaxed text-slate-800">
              Don&apos;t get overlooked.
            </p>
            <p className="text-lg leading-relaxed text-slate-700">
              Recruiters move quickly — not because they don&apos;t care, but because they have to.
            </p>
            <p className="text-lg leading-relaxed text-slate-700">
              I&apos;ve reviewed thousands of resumes over 20+ years in talent acquisition. The difference between &quot;maybe&quot; and &quot;interview&quot; is often clarity.
            </p>
            <p className="text-lg leading-relaxed text-slate-700">
              This recruiter-calibrated audit shows you what&apos;s working — and what might be getting buried.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-8">
            <form action="/api/checkout" method="POST">
              <button
                type="submit"
                disabled={submissionStatus.limitReached}
                className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold shadow-sm transition duration-200 ${
                  submissionStatus.limitReached 
                    ? "bg-slate-400 text-slate-100 cursor-not-allowed" 
                    : "bg-slate-900 text-white hover:bg-slate-800 hover:transform hover:translate-y-[-2px] hover:shadow-md active:translate-y-0 cursor-pointer"
                }`}
              >
                {submissionStatus.loading 
                  ? "Loading..." 
                  : submissionStatus.limitReached 
                    ? "Beta Limit Reached" 
                    : "Run the 6-Second Test"}
              </button>
            </form>

            <p className="text-sm text-slate-600">
              $29 • Beta: delivered within 24 hours
              {!submissionStatus.loading && !submissionStatus.error && (
                <span className="block mt-1">
                  {submissionStatus.limitReached 
                    ? "All beta slots filled" 
                    : `${submissionStatus.remaining} of ${submissionStatus.limit} beta slots remaining`}
                </span>
              )}
            </p>
          </div>

          {submissionStatus.limitReached && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
              <p className="text-sm font-medium">
                We&apos;ve reached our beta testing limit of {submissionStatus.limit} submissions. 
                Thank you for your interest! Please check back later when we launch the full version.
              </p>
            </div>
          )}

          <p className="text-sm text-slate-500">
            No keyword stuffing. No hype. Just clarity.
          </p>
        </header>

        <section className="mt-14 space-y-10">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              How it works
            </h2>
            <ol className="mt-4 space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold">1</span>
                <span>Purchase the 6-Second Test</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold">2</span>
                <span>Upload your resume (PDF format)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold">3</span>
                <span>Receive a detailed report within 24 hours</span>
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              What you&apos;ll get
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-700">Recruiter Readiness Score (0-100)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-700">Quick Verdict (2-3 sentences)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-700">Section-by-Section Review</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-700">Top 3 High-Leverage Fixes</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-700">One Rewritten Bullet Example</span>
              </li>
            </ul>
          </div>
        </section>

        <footer className="mt-16 border-t border-slate-200 pt-8 text-sm text-slate-500">
          <p>© 2026 The 6-Second Test™. All rights reserved.</p>
          <p className="mt-2">Created by Oscar Chavez, Talent Acquisition Leader</p>
        </footer>
      </div>
    </main>
  );
}


