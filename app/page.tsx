"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
              Recruiters move quickly! Not because they don&apos;t care, but because they have to.
            </p>
            <p className="text-lg leading-relaxed text-slate-700">
              I&apos;ve reviewed thousands of resumes over 20+ years in talent acquisition. The difference between &quot;maybe&quot; and &quot;interview&quot; often comes down to clarity.
            </p>
            <p className="text-lg leading-relaxed text-slate-700">
              This recruiter-calibrated audit shows you what&apos;s working, and what might be getting buried.
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
                <span className="text-slate-700">A Recruiter Readiness Score (0-100)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-700">Credibility alignment (title vs. scope)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-700">Impact compression (are outcomes buried?)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-700">Outcome clarity feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-700">3 high-leverage improvements</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-700">One rewritten bullet example</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-700">A realistic screening perspective</span>
              </li>
            </ul>
            
            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h3 className="text-sm font-semibold text-slate-700">A quick note on privacy</h3>
              <p className="mt-2 text-sm text-slate-600">
                Your resume is used only to generate your report and is not stored after processing. Your email is used to deliver your report (and optional updates if you opt in later).
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-800">
                Why I Built This
              </h2>
              <div className="mt-4 space-y-4 text-slate-700">
                <p>
                  I&apos;ve spent two decades hiring across industries, and I still review resumes daily. Strong candidates get missed not because they lack talent, but because their impact isn&apos;t immediately visible.
                </p>
                <p>
                  The 6-Second Test isn&apos;t a resume rewrite service. It&apos;s not an AI keyword generator, and it&apos;s definitely not a &quot;Beat the ATS&quot; gimmick. It&apos;s a clarity audit — built from how real recruiters actually screen, and designed to help you build your resume with intention.
                </p>
                <p className="font-medium mt-6">
                  Rooting &amp; Recruiting for you,<br />
                  -Oscar from LinkedIn
                </p>
                <div className="mt-3">
                  <a
                    href="https://www.linkedin.com/in/ochavezj/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 mr-1"
                    >
                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                    </svg>
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-slate-200 shadow-md relative">
                <Image
                  src="https://media.licdn.com/dms/image/v2/D5603AQGeWU_n3lu35g/profile-displayphoto-shrink_400_400/B56ZV.N_fDHQAg-/0/1741579352305?e=1773273600&v=beta&t=14Oikfqg8qsgdMxCMR7AgIo_TG9X6GtqVsJqp6RxIcQ"
                  alt="Oscar Chavez"
                  fill
                  sizes="(max-width: 768px) 100vw, 192px"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-slate-200 pt-8 text-sm text-slate-500">
          <p>© 2026 The 6-Second Test™. All rights reserved.</p>
          <p className="mt-2">Created by Oscar Chavez - A Real Recruiter</p>
          
          <div className="mt-6 text-xs text-slate-400 space-y-2">
            <p>
              This tool provides automated feedback based on common recruiter screening patterns and does not guarantee interviews or job offers.
            </p>
            <p>
              Because this is a digital evaluation delivered after purchase, all sales are final. If you experience a technical issue, reach out and we&apos;ll make it right.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}


