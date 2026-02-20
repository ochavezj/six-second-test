import Image from 'next/image';

export default function Home() {
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
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:transform hover:translate-y-[-2px] hover:shadow-md active:translate-y-0 duration-200 cursor-pointer"
              >
                Run the 6-Second Test
              </button>
            </form>

            <p className="text-sm text-slate-600">$29 • Beta: delivered within 24 hours</p>
          </div>

          <p className="text-sm text-slate-500">
            No keyword stuffing. No hype. Just clarity.
          </p>
        </header>

        <section className="mt-14 space-y-10">
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6">
            <h2 className="text-lg font-semibold">What you’ll receive</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
              <li>A Recruiter Readiness Score (0–100)</li>
              <li>Credibility alignment (title vs. scope)</li>
              <li>Impact compression (are outcomes buried?)</li>
              <li>Outcome clarity feedback</li>
              <li>3 high-leverage improvements</li>
              <li>One rewritten bullet example</li>
              <li>A realistic screening perspective</li>
            </ul>
            
            <div className="mt-6 p-4 border border-slate-200 rounded-lg bg-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-sm text-slate-500 px-4 py-2 bg-white/90 rounded-full border border-slate-200">
                  Sample Preview
                </div>
              </div>
              <div className="flex items-center mb-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-800">
                  72
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-slate-900">Recruiter Readiness Score</h3>
                  <p className="text-sm text-slate-600">Good clarity, some improvements needed</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded-full w-full">
                  <div className="h-3 bg-slate-700 rounded-full w-3/4"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Credibility</span>
                  <span>75%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">How it works</h2>
            <ol className="mt-4 space-y-3 text-slate-700">
              <li>
                <span className="font-semibold">1)</span> Pay $29 via Stripe
              </li>
              <li>
                <span className="font-semibold">2)</span> Upload your resume (PDF) + provide your email
              </li>
              <li>
                <span className="font-semibold">3)</span> Receive your report within 24 hours
              </li>
            </ol>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6">
            <h2 className="text-lg font-semibold">A quick note on privacy</h2>
            <p className="mt-3 text-slate-700">
              Your resume is used only to generate your report and is not stored after processing.
              Your email is used to deliver your report (and optional updates if you opt in later).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Why I built this</h2>
              <p className="mt-3 text-slate-700">
                I&apos;ve spent two decades hiring across industries, and I still review resumes daily.
                Strong candidates get missed not because they lack talent, but because their impact isn&apos;t immediately visible.
              </p>
              <p className="mt-3 text-slate-700">
                The 6-Second Test isn&apos;t a resume rewrite service. It&apos;s not an AI keyword generator, and it&apos;s definitely not a &quot;Beat ATS&quot; gimmick.
                It&apos;s a clarity audit — built from how real recruiters actually screen.
              </p>
             <p className="mt-3 text-slate-700">
               Rooting & Recruiting for you,<br />Oscar from LinkedIn
             </p>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-slate-200 overflow-hidden relative">
                <img
                  src="https://media.licdn.com/dms/image/v2/D5603AQGeWU_n3lu35g/profile-displayphoto-shrink_400_400/B56ZV.N_fDHQAg-/0/1741579352305?e=1773273600&v=beta&t=14Oikfqg8qsgdMxCMR7AgIo_TG9X6GtqVsJqp6RxIcQ"
                  alt="Oscar from LinkedIn"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-slate-200 pt-8 text-sm text-slate-500">
          <p>
            This tool provides automated feedback based on common recruiter screening patterns and
            does not guarantee interviews or job offers.
          </p>
          <p className="mt-2">
            Because this is a digital evaluation delivered after purchase, all sales are final.
            If you experience a technical issue, reach out and we’ll make it right.
          </p>
        </footer>
      </div>
    </main>
  );
}

