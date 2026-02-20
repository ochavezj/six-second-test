export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="space-y-6">
          <p className="text-sm font-medium tracking-wide text-slate-600">
            by Oscar from LinkedIn
          </p>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            The 6-Second Test™
          </h1>

          <p className="text-lg leading-relaxed text-slate-700">
            Don’t get overlooked.
            <br />
            Recruiters move quickly — not because they don’t care, because they
            have to.
          </p>

          <p className="text-lg leading-relaxed text-slate-700">
            This recruiter-calibrated resume audit shows you what’s clear — and
            what might be getting buried.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
           <form action="/api/checkout" method="POST">
  <button
    type="submit"
    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-slate-800"
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
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
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

          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold">A quick note on privacy</h2>
            <p className="mt-3 text-slate-700">
              Your resume is used only to generate your report and is not stored after processing.
              Your email is used to deliver your report (and optional updates if you opt in later).
            </p>
          </div>

          <div className="border-t border-slate-200 pt-10">
            <h2 className="text-lg font-semibold">Why I built this</h2>
            <p className="mt-3 text-slate-700">
              Strong candidates get missed every day because their impact isn’t immediately visible.
              The 6-Second Test helps you surface your strongest signal fast — without guesswork.
            </p>
            <p className="mt-4 text-slate-700">— Oscar from LinkedIn</p>
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

